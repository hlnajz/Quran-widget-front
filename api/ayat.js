const axios = require("axios");
const { createCanvas, registerFont, Image } = require("canvas");
const path = require("path");

// Amiri font for arabic text
registerFont(path.join(__dirname, "../public/fonts/Amiri-Regular.ttf"), {
  family: "Amiri",
});

// Fetch Ayat Data from Remote JSON API Mine - https://quran-ayat-json.vercel.app/
async function getAyatData() {
  try {
    const response = await axios.get("https://quran-ayat-json.vercel.app/");
    return response.data; // Return the JSON data
  } catch (error) {
    console.error("Error fetching ayat data:", error);
    return null;
  }
}

// Get a Random Ayah
function getRandomAyah(ayat) {
  return ayat[Math.floor(Math.random() * ayat.length)];
}

// Split text into lines with max 7 words per line
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

  if (currentLine.length > 0) {
    lines.push(currentLine.join(" "));
  }

  return lines;
}

// Define themes
const themes = {
  dark: {
    borderColor: "#FF5555",
    footerColor: "#FF5555",
    bgColor: "#1a1a1d",
    textColor: "#ffffff",
  },
  light: {
    borderColor: "#00BFFF",
    footerColor: "#00BFFF",
    bgColor: "#ffffff",
    textColor: "#000000",
  },
  ocean: {
    borderColor: "#0077B6",
    footerColor: "#0096C7",
    bgColor: "#CAF0F8",
    textColor: "#03045E",
  },
  forest: {
    borderColor: "#228B22",
    footerColor: "#32CD32",
    bgColor: "#E0F2F1",
    textColor: "#004D40",
  },
  sunset: {
    borderColor: "#FF4500",
    footerColor: "#FF6347",
    bgColor: "#FFF5E1",
    textColor: "#8B0000",
  },
  royal: {
    borderColor: "#6A0DAD",
    footerColor: "#8A2BE2",
    bgColor: "#F3E5F5",
    textColor: "#4B0082",
  },
  desert: {
    borderColor: "#FFA500",
    footerColor: "#FFD700",
    bgColor: "#FFF3E0",
    textColor: "#8B4513",
  },
};

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

// Route 2: Generate and Return Ayah as Image
module.exports.image = async (req, res) => {
  const {
    theme = "dark", // default setting
    type = "vertical",
    width = 800,
    height = 500,
  } = req.query;

  const canvasWidth = parseInt(width, 10);
  const canvasHeight = parseInt(height, 10);

  // styiling variables and size of fonts parameters
  const padding = 20;
  const lineSpacing = 25;
  const borderWidth = 20;
  const footerMargin = 30;
  const sectionMarginTop = 40;
  const sectionMarginBottom = 20;
  const ayatData = await getAyatData();

  // Get the selected theme
  const selectedTheme = themes[theme] || themes.dark; // Default to dark theme if invalid theme is passed

  const footerColor = selectedTheme.footerColor;
  const borderColor = selectedTheme.borderColor;

  if (ayatData) {
    const randomAyah = getRandomAyah(ayatData);

    const arabicHadithLines = wrapText(randomAyah.hadith.arabic, 7);
    const englishHadithLines = wrapText(randomAyah.hadith.english, 7);
    const englishAyahLines = wrapText(randomAyah.text.english, 7);

    const fontSize = Math.min(canvasWidth / 30, canvasHeight / 20);

    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext("2d");

    // Drawing Canvas
    ctx.fillStyle = borderColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = selectedTheme.bgColor;
    ctx.fillRect(
      borderWidth,
      borderWidth,
      canvas.width - 2 * borderWidth,
      canvas.height - 2 * borderWidth
    );

    const startX = padding + borderWidth;
    const endX = canvasWidth - padding - borderWidth;

    // Arabic Ayah
    ctx.font = `${fontSize}px Amiri`;
    ctx.fillStyle = selectedTheme.textColor;
    ctx.textAlign = "right";
    let yOffset = sectionMarginTop + borderWidth;
    ctx.fillText(randomAyah.text.arabic, endX, yOffset);

    yOffset += 20 + sectionMarginBottom;

    // English Ayah
    ctx.font = `${fontSize * 0.8}px Arial`;
    ctx.textAlign = "left";
    englishAyahLines.forEach((line) => {
      ctx.fillText(line, startX, yOffset);
      yOffset += lineSpacing;
    });

    yOffset += 2 + sectionMarginBottom;

    ctx.font = `${fontSize * 0.8}px Arial`;
    ctx.textAlign = "left"; // Left-align Surah and Ayah
    ctx.fillText(
      `- Surah: ${randomAyah.surah}, Ayah: ${randomAyah.ayah}`,
      startX,
      yOffset
    );

    yOffset += 10 + sectionMarginBottom;

    // Arabic Hadith
    ctx.font = `${fontSize * 0.9}px Amiri`;
    ctx.textAlign = "right";
    arabicHadithLines.forEach((line) => {
      ctx.fillText(line, endX, yOffset);
      yOffset += lineSpacing;
    });

    yOffset += 2 + sectionMarginBottom;

    //English Hadith
    ctx.font = `${fontSize * 0.8}px Arial`;
    ctx.textAlign = "left";
    englishHadithLines.forEach((line) => {
      ctx.fillText(line, startX, yOffset);
      yOffset += lineSpacing;
    });

    yOffset += 2 + sectionMarginBottom;

    // background
    const logoPath = path.join(__dirname, "../public/bga.png");
    const logo = new Image();
    logo.onload = () => {
      const logoWidth = canvasWidth;
      const logoHeight = (logo.height / logo.width) * logoWidth;
      const logoX = (canvasWidth - logoWidth) / 2;
      const logoY = (canvasHeight - logoHeight) / 2 - 50;
      ctx.drawImage(logo, logoX, logoY, logoWidth, logoHeight);

      // Footer
      ctx.font = `${fontSize * 0.6}px Arial`;
      ctx.textAlign = "center";
      const footerY = canvasHeight - footerMargin;
      ctx.fillStyle = footerColor;
      ctx.fillText("Quran Sunnah Reminder", canvasWidth / 2, footerY - 40);
      ctx.font = `${fontSize * 0.5}px Arial`;
      ctx.fillText(
        "by Hamza Labbaalli - hlnajz",
        canvasWidth / 2,
        footerY - 20
      );
      ctx.font = `${fontSize * 0.5}px Arial`;
      ctx.fillText(
        "لا تنسونا من صالح الدعاء لي ولوالديّ، وترحموا على أخي أمين أمهيث",
        canvasWidth / 2,
        footerY
      );

      // Send the generated image as a response PNG format
      res.setHeader("Content-Type", "image/png");
      res.send(canvas.toBuffer());
    };
    logo.src = logoPath; // Set the source after attaching the onload handler
  } else {
    res.status(500).json({ error: "Failed to fetch Quran Sunnah data" });
  }
};
