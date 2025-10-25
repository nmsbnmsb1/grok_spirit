<div align="center">

# 🎨 Grok Spirit

*Grok Imagen Parameter Editor - Chrome Extension*

[English](README.md) | [中文](README_zh.md)

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/logaoplejbodjhnogdndgllocmpmlako?label=Chrome%20Web%20Store&color=blue)](https://chromewebstore.google.com/detail/logaoplejbodjhnogdndgllocmpmlako)
[![Chrome Web Store Users](https://img.shields.io/chrome-web-store/users/logaoplejbodjhnogdndgllocmpmlako?label=Active%20Users&color=green)](https://chromewebstore.google.com/detail/logaoplejbodjhnogdndgllocmpmlako)
[![GitHub stars](https://img.shields.io/github/stars/OtokoNoIzumi/grok_spirit?color=yellow&label=GitHub%20Stars)](https://github.com/OtokoNoIzumi/grok_spirit/stargazers)
[![GitHub license](https://img.shields.io/github/license/OtokoNoIzumi/grok_spirit?color=blue)](https://github.com/OtokoNoIzumi/grok_spirit/blob/main/LICENSE)
[![GitHub last commit](https://img.shields.io/github/last-commit/OtokoNoIzumi/grok_spirit)](https://github.com/OtokoNoIzumi/grok_spirit/commits)

**A Chrome extension that reveals and allows editing of Grok Imagen prompt parameters**

![Grok Spirit Screenshot](https://otokonoizumi.github.io/media/grok%20spirit.png)

[🏪 Chrome Web Store](https://chromewebstore.google.com/detail/logaoplejbodjhnogdndgllocmpmlako) · [📋 Usage Guide](#usage-guide) · [🛠️ Local Installation](#local-installation) · [❓ Issues](https://github.com/OtokoNoIzumi/grok_spirit/issues)

</div>

---

## ✨ Features

- 🔎 **Prompt Capture** - Automatically records the exact JSON Grok uses for every finished video
- 📋 **Clipboard Injection** - One click pulls JSON/text from your clipboard and fills Grok’s textarea for quick tweaks
- 🗂️ **Folder & Sequence Naming** - Configure the target folder and 3‑digit sequence so downloads stay organized
- 💾 **One-click Download** - Download the MP4 and metadata JSON together using the naming rules you set
- ♻️ **Local Caching** - Each `/imagine/post/...` page keeps its latest prompt/status so you can revisit it later

## 🪶 Minimal Version Overview

The build contained in this repository is the “lite” Grok Spirit panel.  
Instead of the earlier multi-pane editor, the minimal version focuses on reliability and two core workflows:

1. **Inspect prompts**: When a Grok video finishes, the panel shows the captured JSON (read-only) plus status/time metadata.
2. **Replay prompts**: Edit JSON in your own editor, copy it, then press **Clipboard** inside Grok Spirit—your changes instantly land in Grok’s textarea and are ready to render.

This streamlined panel also exposes two text fields (folder + sequence). They decide where the extension stores the downloaded MP4/JSON pair, producing paths such as `Grok/my-project/007.mp4` and `Grok/my-project/007.json`.

## 🚀 Quick Start

### Chrome Web Store Installation (Mainline Build)

> The Chrome Web Store hosts the classic/mainline Grok Spirit release. The lite build in this repo is **not** published there, but you can still install the official version from the store if you prefer.

[Install mainline release](https://chromewebstore.google.com/detail/logaoplejbodjhnogdndgllocmpmlako)

### Local Installation (Lite Build)

1. **Download Project**
   ```bash
   git clone https://github.com/OtokoNoIzumi/grok_spirit.git
   # or download ZIP file and extract
   ```

2. **Load Extension**
   - Open Chrome browser and visit `chrome://extensions/`
   - Enable "Developer mode" in the top right corner
   - Click "Load unpacked extension"
   - Select the project directory

3. **Start Using (Manual Load Required)**
   - Visit grok.com/imagine
   - The extension will automatically activate and show the Grok Spirit prompt panel

## 📖 Usage Guide

### Minimal Workflow

1. **Generate a video** on `grok.com/imagine`. When the request finishes, Grok Spirit captures the JSON and shows it in the panel.
2. **Review the data** inside the read-only textarea. The status chip reflects whether the latest request is processing, failed, or complete.
3. **Edit externally if needed**. Copy the JSON into your favorite editor, make changes, copy it back, then hit **Clipboard** to push it into Grok’s textarea automatically.
4. **Set download naming**. Fill in `Folder` (e.g., `demo-run`) and `Sequence` (e.g., `7`). The extension will persist these per video page.
5. **Click Download**. Both the MP4 and metadata JSON will be saved under `Grok/<Folder>/<Sequence>.{mp4,json}` (HD is requested automatically when possible).

### Clipboard Tips

- The button accepts plain text, structured JSON, or multi-locale JSON (the `en` branch is injected into Grok).
- After filling, Grok’s native UI treats the text as if you typed/pasted it, so you can immediately press “Generate”.

## 🎬 Video Metadata Processing

For users who download multiple videos, I provide a Python tool for batch processing:

### What it does
- **Metadata Embedding**: Embeds JSON metadata into MP4 files using FFmpeg
- **Smart Renaming**: Automatically organizes files by prompt groups and versions
- **Batch Processing**: Process entire directories of downloaded videos at once

### Quick Setup
1. **Prerequisites**: Python 3.10+, FFmpeg
2. **Installation**:
   ```bash
   cd grok_video_processor
   pip install -r requirements.txt
   ```
3. **Usage**:
   ```bash
   python meta_video.py
   ```

### File Organization
The tool automatically organizes your downloaded videos:
- Groups videos by similar prompts
- Assigns priority numbers (P1, P2, etc.)
- Adds version numbers within groups (v1, v2, etc.)
- Final format: `grok_video_[uuid]_P1_v1.mp4`

### Language Note
⚠️ **Important**: The Python script (`meta_video.py`) currently uses Chinese prompts and messages. This is a personal tool primarily designed for Chinese users.

**Feel free to edit** the script to translate prompts to your preferred language, or create your own localized version. The core functionality is language-independent and will work regardless of the prompt language.

**📖 Detailed documentation**: See [`grok_video_processor/README.md`](grok_video_processor/README.md) for complete setup and usage instructions.

## 🤝 Contributing

Welcome to contribute code! Please follow these steps:

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Thanks to the following open source projects and developers for inspiration and help:

- [Grok](https://grok.com/) - Provides a powerful AI image generation platform
- Chrome Extension Development Community - Provides rich resources and guidance for extension development
- [@nmsbnmsb1](https://github.com/nmsbnmsb1) - Initial dark mode implementation ideas and contributions

## 📈 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=OtokoNoIzumi/grok_spirit&type=Date)](https://star-history.com/#OtokoNoIzumi/grok_spirit&Date)
