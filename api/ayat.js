const axios = require("axios");
const { createCanvas, registerFont } = require("canvas");
const path = require("path");

// Register the Amiri font from the public folder
registerFont(path.join(__dirname, "../public/fonts/Amiri-Regular.ttf"), {
  family: "Amiri",
});

// Fetch Ayat Data from Remote JSON
async function getAyatData() {
  try {
    const response = await axios.get("https://quran-ayat-json.vercel.app/");
    return response.data; // Return the JSON data
  } catch (error) {
    console.error("Error fetching ayat data:", error);
    return null;
  }
}

// Helper Function: Word Wrapping (limit to X words per line)
function wrapText(ctx, text, maxWordsPerLine, startX, startY, lineHeight) {
  const words = text.split(" ");
  let currentLine = "";
  let y = startY;

  for (let i = 0; i < words.length; i++) {
    const testLine = currentLine + (currentLine.length ? " " : "") + words[i];
    const testWidth = ctx.measureText(testLine).width;

    if (testWidth > ctx.canvas.width - 50) {
      // If the line exceeds the width, draw the current line and start a new one
      ctx.fillText(currentLine, startX, y);
      currentLine = words[i];
      y += lineHeight;
    } else {
      currentLine = testLine;
    }
  }
  ctx.fillText(currentLine, startX, y); // Draw the last line
}

// Helper Function: Get Random Ayah
function getRandomAyah(ayat) {
  return ayat[Math.floor(Math.random() * ayat.length)];
}

// Route 1: Return Random Ayah as JSON
module.exports.json = async (req, res) => {
  const ayatData = await getAyatData();
  if (ayatData) {
    const randomAyah = getRandomAyah(ayatData);
    res.json(randomAyah);
  } else {
    res.status(500).json({ error: "Failed to fetch ayat data" });
  }
};

// Route 2: Generate and Return Ayah as Image (Customizable)
module.exports.image = async (req, res) => {
  const {
    theme = "dark", // default to dark theme
    type = "vertical", // default to vertical type
    width = 800, // default width
    height = 300, // default height
  } = req.query;

  // Parse width and height to integers
  const canvasWidth = parseInt(width, 10);
  const canvasHeight = parseInt(height, 10);

  const ayatData = await getAyatData();

  if (ayatData) {
    const randomAyah = getRandomAyah(ayatData);

    // Create Canvas based on the user's input width and height
    let canvasHeightAdjusted =
      type === "horizontal" ? canvasHeight : canvasHeight || 300; // Use the height from query for both types
    const canvas = createCanvas(canvasWidth, canvasHeightAdjusted);
    const ctx = canvas.getContext("2d");

    // Set background color based on theme (dark or light)
    ctx.fillStyle = theme === "dark" ? "#1a1a1d" : "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the Arabic Ayah text
    ctx.font = "30px Amiri"; // Use Amiri font
    ctx.fillStyle = theme === "dark" ? "#ffffff" : "#000000";
    wrapText(ctx, randomAyah.text.arabic, 8, 50, 100, 40); // Limit to 8 words per line

    // Draw the English translation text (smaller and limit to 8 words per line)
    ctx.font = "20px Arial";
    wrapText(ctx, randomAyah.text.english, 8, 50, 150, 30);

    // Draw the Hadith Arabic text (limit to 8 words per line and smaller font)
    ctx.font = "16px Amiri";
    wrapText(ctx, randomAyah.hadith.arabic, 8, 50, 200, 30);

    // Draw the Hadith English text (limit to 8 words per line and smaller font)
    ctx.font = "16px Arial";
    wrapText(ctx, randomAyah.hadith.english, 8, 50, 230, 30);

    // Surah and Ayah details (smaller text)
    ctx.font = "16px Arial";
    ctx.fillText(
      `- Surah: ${randomAyah.surah}, Ayah: ${randomAyah.ayah}`,
      50,
      260
    );

    // Draw footer text: "Quran Sunnah Reminder"
    ctx.font = "14px Arial";
    ctx.fillStyle = "#888";
    const footerText = "Quran Sunnah Reminder";
    const footerWidth = ctx.measureText(footerText).width;
    ctx.fillText(
      footerText,
      (canvas.width - footerWidth) / 2,
      canvas.height - 20
    );

    // Send the generated image as a response (PNG format)
    res.setHeader("Content-Type", "image/png");
    res.send(canvas.toBuffer());
  } else {
    res.status(500).json({ error: "Failed to fetch ayat data" });
  }
};
