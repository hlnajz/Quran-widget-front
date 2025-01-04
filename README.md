# Quran Sunnah Widget

This project generates a random **Quranic Ayah** (verse) along with its **English translation** and a **Hadith** (prophetic saying) and displays them as an image. It allows customization through query parameters, such as the theme, size, and layout of the generated image.

## Features

- Generate a random **Quran Ayah** and **Hadith**.
- Customizable themes (`dark` or `light`).
- Support for image type: **horizontal** or **vertical**.
- Responsive layout with configurable width and height.
- Includes a footer with the text: `"Quran Sunnah Reminder"` and `"by Hamza Labbaalli. Pray for me."`.

## Live Demo

You can test the API using the following endpoint:

https://quran-widget-front.vercel.app/ayat/image

shell
Copy code

### Example Usage:

https://quran-widget-front.vercel.app/ayat/image?theme=light&type=horizontal&width=600&height=400

shell
Copy code

## API Endpoints

### 1. JSON Endpoint

This endpoint returns the random Ayah data in JSON format.

**URL:**
/ayat/json

css
Copy code

**Response:**

```json
{
  "surah": "An-Nas",
  "ayah": 1,
  "text": {
    "arabic": "قُلْ أَعُوذُ بِرَبِّ النَّاسِ",
    "english": "Say, 'I seek refuge in the Lord of mankind.'"
  },
  "hadith": {
    "arabic": "قَالَ رَسُولُ اللَّهِ ﷺ: 'يَسِّرُوا وَلَا تُعَسِّرُوا.'",
    "english": "The Prophet (ﷺ) said: 'Make things easy and do not make them hard.'"
  }
}
2. Image Generation Endpoint
This endpoint generates and returns the Ayah and Hadith as an image. It supports various query parameters for customization.

URL:

arduino
Copy code
/ayat/image
Query Parameters:

theme: Theme of the image. Accepts dark or light. Default is dark.
type: Type of the image layout. Accepts horizontal or vertical. Default is vertical.
width: Width of the generated image in pixels. Default is 800.
height: Height of the generated image in pixels. Default is 300.
Example Request:
bash
Copy code
https://quran-widget-front.vercel.app/ayat/image?theme=light&type=horizontal&width=600&height=400
Generated Image Features:

The Quranic Ayah is displayed in Arabic at the top.
The English translation of the Ayah is displayed below.
The Surah and Ayah number are displayed after the translations.
The Hadith in Arabic and its English translation are displayed under the Surah and Ayah info.
At the bottom, you will find the "Quran Sunnah Reminder" footer text.
Below the footer, there is an additional text: "by Hamza Labbaalli. Pray for me." in smaller font.
Installation
Clone the Repository:

bash
Copy code
git clone https://github.com/your-username/quran-widget.git
cd quran-widget
Install Dependencies: Make sure you have Node.js and npm installed. Then install the required dependencies:

bash
Copy code
npm install
Run the Application Locally: After the dependencies are installed, you can run the application locally:

bash
Copy code
npm start
By default, the server will be available at http://localhost:3000.

Deploy to Vercel (Optional): If you want to deploy the project to Vercel or any other hosting platform, you can follow the platform’s instructions to deploy a Node.js app.

Project Structure
graphql
Copy code
quran-widget/
├── api/
│   └── ayat.js           # Main API logic for generating random Ayah and Hadith
├── public/
│   └── fonts/            # Custom fonts (e.g., Amiri font)
│       └── Amiri-Regular.ttf
├── node_modules/          # Node.js dependencies
├── package.json           # Project configuration file
├── vercel.json            # Vercel deployment configuration
└── index.js               # Server entry point
Contributing
Fork the Repository
Create a new branch (git checkout -b feature-name)
Commit your changes (git commit -am 'Add new feature')
Push to the branch (git push origin feature-name)
Open a Pull Request
License
This project is licensed under the MIT License - see the LICENSE file for details.
```
