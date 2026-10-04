# ALSON-XMD WhatsApp Bot

A complete, production-ready, modular WhatsApp multi-device bot built with Node.js and `@whiskeysockets/baileys`, featuring phone-number pairing, persistent authentication session, isolated plugin architecture, dual verified owners (`263783549857` & `263786359833`), `.mode`, `.antibot`, `.togstatus`, `.getpp`, `.vv`, `.play`, `.shazam`, media utilities, and Google Gemini AI integration.

---

## Project Structure

```
Alson/
├── index.js
├── pair.js
├── package.json
├── .env.example
├── .gitignore
├── config/
│   └── index.js
├── lib/
│   ├── ai/
│   ├── media/
│   │   ├── downloader.js
│   │   ├── converter.js
│   │   └── uploader.js
│   ├── antiBot.js
│   ├── botMode.js
│   ├── status.js
│   ├── connection.js
│   ├── commandHandler.js
│   └── pluginLoader.js
├── plugins/
│   ├── ai.js
│   ├── pair.js
│   ├── getpp.js
│   ├── vv.js
│   ├── togstatus.js
│   ├── antibot.js
│   ├── mode.js
│   ├── play.js
│   ├── shazam.js
│   ├── sticker.js
│   ├── toimg.js
│   ├── tomp3.js
│   ├── tagall.js
│   ├── groupinfo.js
│   ├── whois.js
│   ├── runtime.js
│   ├── owner.js
│   ├── ping.js
│   ├── alive.js
│   ├── menu.js
│   └── help.js
└── session/
```

---

## 1. Installation

Install all required dependencies:

```bash
npm install
```

---

## 2. Configuration (`.env`)

```env
BOT_NAME=ALSON-XMD
PREFIX=.
OWNER_NUMBERS=263786359833,263783549857
PAIRING_NUMBER=263783549857
PAIRING_BRAND=ALSON-XMD
GEMINI_API_KEY=your_gemini_api_key_here
AI_PROVIDER=gemini
AI_MODEL=gemini-3.8-flash
AI_API_KEY=
SHAZAM_API_KEY=your_shazam_api_key_here
CHATBOT_ENABLED=false
CHATBOT_GROUPS=false
CHATBOT_PRIVATE=false
```

---

## 3. Key Features & Commands

- **`.mode <public|private|status>`**: Toggle or check bot operating mode (Owner Only).
- **`.antibot <on|off|status|unpair>`**: Manage Anti-Bot protection and self-unpair settings (Owner Only).
- **`.togstatus` (reply to media/text)**: Publish quoted image, video, audio, or text as WhatsApp Status (Owner Only).
- **`.pair <number>`**: Request pairing code for a target number (Owner Only).
- **`.getpp [number]` (or reply)**: Retrieve profile picture of a user (Owner Only).
- **`.vv` (reply to view-once)**: Retrieve View Once image or video media.
- **`.ai <prompt>`**: Ask questions to ALSON-XMD AI Assistant.
- **`.play <song>`**: Search and play music audio.
- **`.shazam` (reply to audio/video)**: Identify songs.

---

## License

Apache-2.0
