const axios = require("axios");
const { createCanvas, registerFont, Image } = require("canvas");
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
    height = 500, // default height (changed to 500)
  } = req.query;

  const canvasWidth = parseInt(width, 10);
  const canvasHeight = parseInt(height, 10);

  const padding = 20; // Padding for margins inside border
  const lineSpacing = 25; // Increased spacing between lines
  const borderWidth = 20; // Thickness of the border
  const footerMargin = 30; // Margin from the footer text to the border
  const sectionMarginTop = 40; // Margin for top of each section (increased for spacing)
  const sectionMarginBottom = 20; // Margin for bottom of each section
  const ayatData = await getAyatData();

  const footerColor = theme === "dark" ? "#FF5555" : "#00BFFF"; // Dark theme (Dracula red) or light theme (sky blue)
  const borderColor = theme === "dark" ? "#FF5555" : "#00BFFF"; // Dark theme (Dracula red) or light theme (sky blue)

  if (ayatData) {
    const randomAyah = getRandomAyah(ayatData);

    // Wrap Hadith into lines with 7 words max
    const arabicHadithLines = wrapText(randomAyah.hadith.arabic, 7);
    const englishHadithLines = wrapText(randomAyah.hadith.english, 7);
    const englishAyahLines = wrapText(randomAyah.text.english, 7); // Wrap English Ayah with 7 words per line

    // Calculate font size dynamically based on canvas width (make it proportional to canvas width)
    const fontSize = Math.min(canvasWidth / 30, canvasHeight / 20); // Adjusting for both width and height

    // Create Canvas based on the user's input width and height
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext("2d");

    // Draw border
    ctx.fillStyle = borderColor; // Set border color based on the theme
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set inner canvas background color (inside the border)
    ctx.fillStyle = theme === "dark" ? "#1a1a1d" : "#ffffff";
    ctx.fillRect(
      borderWidth,
      borderWidth,
      canvas.width - 2 * borderWidth,
      canvas.height - 2 * borderWidth
    );

    // Set padding for the content inside the border
    const startX = padding + borderWidth;
    const endX = canvasWidth - padding - borderWidth;

    // Draw the Arabic Ayah text (right-aligned, smaller size)
    ctx.font = `${fontSize}px Amiri`; // Dynamic font size for Arabic
    ctx.fillStyle = theme === "dark" ? "#ffffff" : "#000000";
    ctx.textAlign = "right"; // Right-align Arabic text
    let yOffset = sectionMarginTop + borderWidth; // Starting position for Arabic Ayah (after border)
    ctx.fillText(randomAyah.text.arabic, endX, yOffset);

    // Margin for the bottom of Arabic Ayah section
    yOffset += 20 + sectionMarginBottom;

    // Draw the English translation text (left-aligned)
    ctx.font = `${fontSize * 0.8}px Arial`; // Slightly smaller font size for English
    ctx.textAlign = "left"; // Left-align English text
    englishAyahLines.forEach((line) => {
      ctx.fillText(line, startX, yOffset);
      yOffset += lineSpacing; // Increase yOffset for the next line
    });

    // Margin for the bottom of English translation section
    yOffset += 2 + sectionMarginBottom;

    // Surah and Ayah details (smaller text)
    ctx.font = `${fontSize * 0.8}px Arial`;
    ctx.textAlign = "left"; // Left-align Surah and Ayah
    ctx.fillText(
      `- Surah: ${randomAyah.surah}, Ayah: ${randomAyah.ayah}`,
      startX,
      yOffset
    );

    // Margin for the bottom of Surah and Ayah details
    yOffset += 20 + sectionMarginBottom;

    // Draw the Arabic Hadith text (right-aligned, line by line)
    ctx.font = `${fontSize * 0.9}px Amiri`; // Adjusted font size for Arabic Hadith
    ctx.textAlign = "right"; // Right-align Arabic Hadith
    arabicHadithLines.forEach((line) => {
      ctx.fillText(line, endX, yOffset);
      yOffset += lineSpacing; // Increase yOffset for the next line
    });

    // Margin for the bottom of Arabic Hadith section
    yOffset += sectionMarginBottom;

    // Draw the English Hadith text (left-aligned, line by line)
    ctx.font = `${fontSize * 0.8}px Arial`; // Adjusted font size for English Hadith
    ctx.textAlign = "left"; // Left-align English Hadith
    englishHadithLines.forEach((line) => {
      ctx.fillText(line, startX, yOffset);
      yOffset += lineSpacing; // Increase yOffset for the next line
    });

    // Margin for the bottom of English Hadith section
    yOffset += sectionMarginBottom;

    // Load and draw the logo (centered)
    const logoPath = path.join(__dirname, "../public/bga.png");
    const logo = new Image();
    logo.onload = () => {
      const logoWidth = canvasWidth; // Adjust logo width as needed
      const logoHeight = (logo.height / logo.width) * logoWidth; // Maintain aspect ratio
      const logoX = (canvasWidth - logoWidth) / 2; // Center horizontally
      const logoY = (canvasHeight - logoHeight) / 2 - 50; // Center vertically (slightly above the center)
      ctx.drawImage(logo, logoX, logoY, logoWidth, logoHeight);

      // Footer (centered) with padding and margin adjustments
      ctx.font = `${fontSize * 0.6}px Arial`; // Dynamic font size for footer
      ctx.textAlign = "center"; // Center-align footer
      const footerY = canvasHeight - footerMargin; // Adjusted position
      ctx.fillStyle = footerColor; // Set footer color based on the theme
      ctx.fillText("Quran Sunnah Reminder", canvasWidth / 2, footerY - 40);
      ctx.font = `${fontSize * 0.5}px Arial`; // Smaller footer font size
      ctx.fillText(
        "by Hamza Labbaalli - hlnajz",
        canvasWidth / 2,
        footerY - 20
      );
      ctx.font = `${fontSize * 0.5}px Arial`; // Smallest footer font size
      ctx.fillText(
        "لا تنسونا من صالح الدعاء لي ولوالديّ، وترحموا على أخي أمين أمهيث",
        canvasWidth / 2,
        footerY
      );

      // Send the generated image as a response (PNG format)
      res.setHeader("Content-Type", "image/png");
      res.send(canvas.toBuffer());
    };
    logo.src = logoPath; // Set the source after attaching the onload handler
  } else {
    res.status(500).json({ error: "Failed to fetch ayat data" });
  }
};
