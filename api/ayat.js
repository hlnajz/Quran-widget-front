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

// Helper Function: Get a Random Ayah
function getRandomAyah(ayat) {
  return ayat[Math.floor(Math.random() * ayat.length)];
}

// Helper Function: Split text into lines with max 7 words per line
function wrapText(text, maxWordsPerLine) {
  const words = text.split(" ");
  const lines = [];
  let currentLine = [];

  words.forEach((word) => {
    currentLine.push(word);
    if (currentLine.length === maxWordsPerLine) {
      lines.push(currentLine.join(" "));
      currentLine = [];
    }
  });

  // Add any remaining words as a new line
  if (currentLine.length > 0) {
    lines.push(currentLine.join(" "));
  }

  return lines;
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

  const padding = 20; // Padding for margins
  const lineSpacing = 25; // Increased spacing between lines
  const ayatData = await getAyatData();

  if (ayatData) {
    const randomAyah = getRandomAyah(ayatData);

    // Wrap Hadith into lines with 7 words max
    const arabicHadithLines = wrapText(randomAyah.hadith.arabic, 7);
    const englishHadithLines = wrapText(randomAyah.hadith.english, 7);

    // Create Canvas based on the user's input width and height
    let canvasHeightAdjusted =
      type === "horizontal" ? canvasHeight : canvasHeight || 300; // Use the height from query for both types
    const canvas = createCanvas(canvasWidth, canvasHeightAdjusted);
    const ctx = canvas.getContext("2d");

    // Set background color based on theme (dark or light)
    ctx.fillStyle = theme === "dark" ? "#1a1a1d" : "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set padding
    const startX = padding;
    const endX = canvasWidth - padding;

    // Draw the Arabic Ayah text (right-aligned, smaller size)
    ctx.font = "24px Amiri"; // Smaller font size for Arabic
    ctx.fillStyle = theme === "dark" ? "#ffffff" : "#000000";
    ctx.textAlign = "right"; // Right-align Arabic text
    ctx.fillText(randomAyah.text.arabic, endX - padding, 100);

    // Draw the English translation text (left-aligned)
    ctx.font = "20px Arial";
    ctx.textAlign = "left"; // Left-align English text
    ctx.fillText(randomAyah.text.english, startX + padding, 140);

    // Surah and Ayah details (smaller text)
    ctx.font = "16px Arial";
    ctx.textAlign = "left"; // Left-align Surah and Ayah
    ctx.fillText(
      `- Surah: ${randomAyah.surah}, Ayah: ${randomAyah.ayah}`,
      startX + padding,
      180
    );

    // Draw the Arabic Hadith text (right-aligned, line by line)
    ctx.font = "18px Amiri";
    ctx.textAlign = "right"; // Right-align Arabic Hadith
    let yOffset = 230; // Start position for Arabic Hadith
    arabicHadithLines.forEach((line) => {
      ctx.fillText(line, endX - padding, yOffset);
      yOffset += lineSpacing; // Increase yOffset for the next line
    });

    // Draw the English Hadith text (left-aligned, line by line)
    ctx.font = "18px Arial";
    ctx.textAlign = "left"; // Left-align English Hadith
    yOffset = 260; // Start position for English Hadith
    englishHadithLines.forEach((line) => {
      ctx.fillText(line, startX + padding, yOffset);
      yOffset += lineSpacing; // Increase yOffset for the next line
    });

    // Footer (centered) with some padding and adjusted position
    ctx.font = "14px Arial";
    ctx.textAlign = "center"; // Center-align footer
    ctx.fillText("Quran Sunnah Reminder", canvasWidth / 2, canvasHeight - 50);
    ctx.font = "12px Arial";
    ctx.fillText(
      "by Hamza Labbaalli. Pray for me.",
      canvasWidth / 2,
      canvasHeight - 30
    );
    ctx.font = "10px Arial";
    ctx.fillText(
      "لا تنسونا من صالح الدعاء لي ولوالديّ، وترحموا على أخي أمين أمهيث",
      canvasWidth / 2,
      canvasHeight - 10
    );

    // Send the generated image as a response (PNG format)
    res.setHeader("Content-Type", "image/png");
    res.send(canvas.toBuffer());
  } else {
    res.status(500).json({ error: "Failed to fetch ayat data" });
  }
};
