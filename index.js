const express = require("express");
const ayatRoutes = require("./api/ayat");

const app = express();
const port = 3000;

// returning random Ayah as JSON
app.get("/ayat/json", ayatRoutes.json);

// generating and returning random Ayah as an image
app.get("/ayat/image", ayatRoutes.image);

app.use(express.static("public"));

app.listen(port, () => {
  console.log(`Quran Sunnah app listening at http://localhost:${port}`);
});
