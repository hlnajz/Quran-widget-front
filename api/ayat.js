const axios = require("axios");
const { createCanvas } = require("canvas");

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
    theme = "dark",
    type = "vertical",
    width = 800,
    height = 300,
  } = req.query;
  const ayatData = await getAyatData();

  if (ayatData) {
    const randomAyah = getRandomAyah(ayatData);

    const canvas = createCanvas(width, type === "vertical" ? height : 200);
    const ctx = canvas.getContext("2d");

    // Background Color
    ctx.fillStyle = theme === "dark" ? "#1a1a1d" : "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Text Styling for Arabic Text
    ctx.font = "30px Arial";
    ctx.fillStyle = theme === "dark" ? "#ffffff" : "#000000";
    ctx.fillText(randomAyah.text.arabic, 50, 100);

    // Text Styling for English Text (smaller size)
    ctx.font = "20px Arial";
    ctx.fillText(randomAyah.text.english, 50, 150);

    // Surah and Ayah details
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
    res.status(500).json({ error: "Failed to fetch ayat data" });
  }
};
