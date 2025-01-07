# Quran Sunnah Reminder API

The Quran Sunnah Reminder API provides endpoints to fetch random Ayahs (verses) from the Quran along with related Hadiths. It offers both JSON responses and dynamically generated images containing the Ayah and Hadith text.

## Features

- **Random Ayah Retrieval**: Fetch a random Ayah from the Quran along with its translation and related Hadith.
- **Image Generation**: Generate images containing the Ayah and Hadith text with customizable themes and dimensions.

## Endpoints

### 1. Get Random Ayah as JSON

- **URL**: `/api/json`
- **Method**: `GET`
- **Response**:
  ```json
  {
    "surah": "Al-Fatiha",
    "ayah": 1,
    "text": {
      "arabic": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      "english": "In the name of Allah, the Most Gracious, the Most Merciful."
    },
    "hadith": {
      "arabic": "قال رسول الله صلى الله عليه وسلم...",
      "english": "The Messenger of Allah (ﷺ) said..."
    }
  }
### 2. Get Ayah as Image
   URL: /api/image
Method: GET
Query Parameters:
theme (optional): Set to dark or light. Default is dark.
width (optional): Image width in pixels. Default is 800.
height (optional): Image height in pixels. Default is 500.
Response: Returns a PNG image containing the Ayah and Hadith text.
Installation
 ```bash
git clone https://github.com/hlnajz/Quran-widget-front.git

 ```
3.
Navigate to the project directory:
 ```bash
cd Quran-widget-front
 ```
Install dependencies:
 ```bash
npm install
 ```
Usage
Start the server:
 ```bash
npm start
 ```
### Access the API:

JSON endpoint: http://localhost:3000/api/json

Image endpoint: http://localhost:3000/api/image



### Customization:

Fonts: The API uses the Amiri font for Arabic text. Ensure the font file is located at public/fonts/Amiri-Regular.ttf.

Logo: To include a custom logo in the generated images, place your image at public/qr.png.

Light Theme
 ```json
https://quran-widget-front.vercel.app/ayat/image?theme=light&type=vertical&width=800&height=500
 ```

Dark Theme
 ```json
https://quran-widget-front.vercel.app/ayat/image?theme=dark&type=vertical&width=800&height=500
 ```

### Dependencies:

axios: For fetching Ayah data.
canvas: For image generation.
express: For setting up the server.

#### Screenshots:

![Dark Theme](https://raw.githubusercontent.com/hlnajz/assets/refs/heads/main/dark-theme.png)

![Light Theme](https://raw.githubusercontent.com/hlnajz/assets/refs/heads/main/light-theme.png)


#### License:
Feel Free to use it and share it 🥇😘

#### Acknowledgements:
Ayah data provided by my quran-ayat-json.
[Quran-Hadith-Api](https://quran-ayat-json.vercel.app/)

### Hadith Sahih ###. translations sourced from authentic collections 
