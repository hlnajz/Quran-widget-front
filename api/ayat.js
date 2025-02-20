const axios = require("axios");
const { createCanvas, registerFont, Image } = require("canvas");
const path = require("path");

// Amiri font for Arabic text
registerFont(path.join(__dirname, "../public/fonts/Amiri-Regular.ttf"), {
  family: "Amiri",
});

// Theme color definitions
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
};

// Fetch Ayat Data
async function getAyatData() {
  try {
    const response = await axios.get("https://quran-ayat-json.vercel.app/");
    return response.data;
  } catch (error) {
    console.error("Error fetching ayat data:", error);
    return null;
  }
}

function getRandomAyah(ayat) {
  return ayat[Math.floor(Math.random() * ayat.length)];
}

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
  if (currentLine.length > 0) lines.push(currentLine.join(" "));

  return lines;
}

// Route 1: Return Random Ayah as JSON
module.exports.json = async (req, res) => {
  const ayatData = await getAyatData();
  if (ayatData) {
    res.json(getRandomAyah(ayatData));
  } else {
    res.status(500).json({ error: "Failed to fetch ayat data" });
  }
};

// Route 2: Generate and Return Ayah as Image
module.exports.image = async (req, res) => {
  const { theme = "dark", width = 800, height = 500 } = req.query;
  const selectedTheme = themes[theme] || themes.dark;
  const canvasWidth = parseInt(width, 10);
  const canvasHeight = parseInt(height, 10);

  const padding = 20;
  const lineSpacing = 25;
  const borderWidth = 20;
  const footerMargin = 30;
  const sectionMarginTop = 40;
  const sectionMarginBottom = 20;
  const ayatData = await getAyatData();

  if (ayatData) {
    const randomAyah = getRandomAyah(ayatData);
    const arabicLines = wrapText(randomAyah.text.arabic, 7);
    const englishLines = wrapText(randomAyah.text.english, 7);
    const fontSize = Math.min(canvasWidth / 30, canvasHeight / 20);

    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = selectedTheme.borderColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = selectedTheme.bgColor;
    ctx.fillRect(
      borderWidth,
      borderWidth,
      canvas.width - 2 * borderWidth,
      canvas.height - 2 * borderWidth
    );

    ctx.fillStyle = selectedTheme.textColor;
    ctx.font = `${fontSize}px Amiri`;
    ctx.textAlign = "right";
    let yOffset = sectionMarginTop + borderWidth;
    arabicLines.forEach((line) => {
      ctx.fillText(line, canvasWidth - padding - borderWidth, yOffset);
      yOffset += lineSpacing;
    });

    yOffset += sectionMarginBottom;
    ctx.font = `${fontSize * 0.8}px Arial`;
    ctx.textAlign = "left";
    englishLines.forEach((line) => {
      ctx.fillText(line, padding + borderWidth, yOffset);
      yOffset += lineSpacing;
    });

    yOffset += sectionMarginBottom;
    ctx.font = `${fontSize * 0.6}px Arial`;
    ctx.fillText(
      `Surah: ${randomAyah.surah}, Ayah: ${randomAyah.ayah}`,
      padding + borderWidth,
      yOffset
    );

    const footerY = canvasHeight - footerMargin;
    ctx.font = `${fontSize * 0.6}px Arial`;
    ctx.textAlign = "center";
    ctx.fillStyle = selectedTheme.footerColor;
    ctx.fillText("Quran Sunnah Reminder", canvasWidth / 2, footerY - 40);
    ctx.font = `${fontSize * 0.5}px Arial`;
    ctx.fillText("by Hamza Labbaalli - hlnajz", canvasWidth / 2, footerY - 20);
    ctx.fillText(
      "لا تنسونا من صالح الدعاء لي ولوالديّ، وترحموا على أخي أمين أمهيث",
      canvasWidth / 2,
      footerY
    );

    res.setHeader("Content-Type", "image/png");
    res.send(canvas.toBuffer());
  } else {
    res.status(500).json({ error: "Failed to fetch Quran Sunnah data" });
  }
};
