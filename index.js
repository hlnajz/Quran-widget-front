const express = require("express");
const { createCanvas } = require("canvas");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// Helper Function: Fetch a random Ayah from the external API (Vercel endpoint)
async function getRandomAyah() {
  try {
    // Make sure to replace this with your actual API URL for Ayat data
    const response = await axios.get("https://quran-ayat-json.vercel.app/");
    const ayatData = response.data;
    const randomIndex = Math.floor(Math.random() * ayatData.length);
    return ayatData[randomIndex];
  } catch (error) {
    console.error("Error fetching Ayat data:", error);
    return null;
  }
}

// Route 1: Return Random Ayah as JSON
app.get("/api/ayat/json", async (req, res) => {
  const randomAyah = await getRandomAyah();
  if (randomAyah) {
    res.json(randomAyah);
  } else {
    res.status(500).json({ error: "Failed to fetch Ayah data" });
  }
});

// Route 2: Generate and Return Ayah as Image
app.get("/api/ayat/image", async (req, res) => {
  const {
    theme = "dark",
    type = "vertical",
    width = 800,
    height = 400,
  } = req.query;
  const randomAyah = await getRandomAyah();

  if (randomAyah) {
    // Convert width and height to integers (in case they are passed as strings)
    const canvasWidth = parseInt(width);
    const canvasHeight = parseInt(height);

    // Define canvas size based on `type` (vertical or horizontal)
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext("2d");

    // Set Background Color based on `theme` (dark or light)
    ctx.fillStyle = theme === "dark" ? "#1a1a1d" : "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set Text Styling for Arabic
    ctx.font = "20px Arial";
    ctx.fillStyle = theme === "dark" ? "#ffffff" : "#000000";

    // Display Arabic text
    const arabicText = randomAyah.text.arabic;
    ctx.fillText(arabicText, 50, 100);

    // Set Text Styling for English (smaller font size)
    ctx.font = "16px Arial";
    const englishText = randomAyah.text.english;
    ctx.fillText(englishText, 50, 150);

    // Additional text for Surah name and Ayah number
    ctx.font = "16px Arial";
    ctx.fillText(
      `- Surah: ${randomAyah.surah}, Ayah: ${randomAyah.ayah}`,
      50,
      200
    );

    // Return as PNG Image
    res.setHeader("Content-Type", "image/png");
    res.send(canvas.toBuffer());
  } else {
    res.status(500).json({ error: "Failed to fetch Ayah data" });
  }
});

// Home Route
app.get("/", (req, res) => {
  res.send(
    "Quran Ayat Widget is running! Use /api/ayat/json or /api/ayat/image."
  );
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
