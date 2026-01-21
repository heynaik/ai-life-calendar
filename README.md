# AI Life Calendar

Transform time into dynamic lock-screen wallpapers. Visualize your year, life, or goals.

![Preview](https://img.shields.io/badge/status-MVP-green) ![License](https://img.shields.io/badge/license-MIT-blue)

## 🌟 Features

- **Year Calendar** - 365 dots showing each day of the year
- **Life Calendar** - Weeks lived vs remaining in your lifetime  
- **Goal Countdown** - Days remaining until your target date
- **iOS Shortcuts Integration** - Auto-updating wallpapers
- **Device Presets** - Optimized for all iPhone models
- **Zero Dependencies** - Pure HTML, CSS, and JavaScript

## 🚀 Quick Start

1. Open `index.html` in your browser
2. Select calendar type (Year / Life / Goal)
3. Choose your device and accent color
4. Download wallpaper or copy URL for auto-updates

## 📱 iOS Auto-Update Setup

1. Copy the dynamic URL from the app
2. Open **Shortcuts** app on iPhone
3. Create new Automation → Time of Day
4. Add action: **Get Contents of URL** (paste your URL)
5. Add action: **Set Wallpaper**
6. Set to run daily - wallpaper updates automatically!

## 🛠 Tech Stack

- HTML5 / CSS3 / Vanilla JavaScript (ES6+)
- Canvas API for PNG rendering
- Inter font from Google Fonts
- No frameworks, no build step required

## 📁 Project Structure

```
/
├── index.html          # Main configuration wizard
├── render.html         # Dynamic image rendering endpoint
├── styles/
│   └── main.css        # Dark minimalist theme
├── js/
│   ├── app.js          # Application logic
│   ├── renderers/
│   │   ├── yearCalendar.js
│   │   ├── lifeCalendar.js
│   │   └── goalCountdown.js
│   └── utils/
│       └── devices.js  # iPhone device presets
└── README.md
```

## 🔗 Dynamic URL Parameters

```
render.html?type=year&device=iphone15pro&accent=ff6b6b
```

| Parameter | Values | Description |
|-----------|--------|-------------|
| `type` | year, life, goal | Calendar type |
| `device` | iphone15promax, iphone15pro, iphone15, iphonese | Device preset |
| `accent` | hex color (no #) | Highlight color |
| `birth` | YYYY-MM-DD | Birth date (life only) |
| `expectancy` | number | Life expectancy (life only) |
| `target` | YYYY-MM-DD | Target date (goal only) |
| `title` | string | Goal name (goal only) |

## 🎨 Design Principles

- Minimalist, calm, high-contrast
- Emotion-first, data-second
- Zero visual clutter  
- Lock-screen optimized with safe areas

## 📄 License

MIT License - feel free to use and modify!

---

Made with ❤️ for founders, creators, and builders who value their time.
