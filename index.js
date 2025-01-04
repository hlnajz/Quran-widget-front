const express = require("express");
const ayatRoutes = require("./api/ayat"); // Import the routes from ayat.js

const app = express();
const port = 3000;

// Route for returning random Ayah as JSON
app.get("/ayat/json", ayatRoutes.json);

// Route for generating and returning random Ayah as an image
app.get("/ayat/image", ayatRoutes.image);

// Serve static files (if needed, like HTML/CSS/JS for front-end)
app.use(express.static("public"));

// Start the server
app.listen(port, () => {
  console.log(`Quran Widget app listening at http://localhost:${port}`);
});
