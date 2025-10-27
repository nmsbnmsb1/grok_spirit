<div align="center">

# 🎨 Grok Spirit · No-Editor Edition 

*Grok Imagen prompt capture & download helper*

> **Current mainline:** this repository ships the Grok Spirit **“No-Editor Edition ”**, focused on clipboard injection and download management. It does **not** include the in-page structured editor.
> Need the classic multi-panel editor? Install the full build instead: [Grok Spirit (Full Edition)](https://github.com/OtokoNoIzumi/grok_spirit) or grab the legacy UI from the Chrome Web Store.

[English](README.md) | [中文](README_zh.md)

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/logaoplejbodjhnogdndgllocmpmlako?label=Chrome%20Web%20Store&color=blue)](https://chromewebstore.google.com/detail/logaoplejbodjhnogdndgllocmpmlako)
[![Chrome Web Store Users](https://img.shields.io/chrome-web-store/users/logaoplejbodjhnogdndgllocmpmlako?label=Active%20Users&color=green)](https://chromewebstore.google.com/detail/logaoplejbodjhnogdndgllocmpmlako)
[![GitHub stars](https://img.shields.io/github/stars/OtokoNoIzumi/grok_spirit?color=yellow&label=GitHub%20Stars)](https://github.com/OtokoNoIzumi/grok_spirit/stargazers)
[![GitHub license](https://img.shields.io/github/license/OtokoNoIzumi/grok_spirit?color=blue)](https://github.com/OtokoNoIzumi/grok_spirit/blob/main/LICENSE)
[![GitHub last commit](https://img.shields.io/github/last-commit/OtokoNoIzumi/grok_spirit)](https://github.com/OtokoNoIzumi/grok_spirit/commits)

**A Chrome extension that captures Grok Imagen video prompts and streamlines downloads**

![Grok Spirit Screenshot](https://otokonoizumi.github.io/media/grok%20spirit.png)

[🏪 Chrome Web Store (Full Edition)](https://chromewebstore.google.com/detail/logaoplejbodjhnogdndgllocmpmlako) · [📋 Usage Guide](#usage-guide) · [🛠️ Local Installation](#local-installation-this-simplified-build) · [❓ Issues](https://github.com/OtokoNoIzumi/grok_spirit/issues)

</div>

---

## ✨ Features (No Built-In Editor)

- 🔎 **Prompt Capture** – Automatically records the JSON Grok uses whenever a video finishes
- 📋 **Clipboard Injection** – Reads plain text/JSON from your clipboard and auto-fills Grok’s textarea
- 🗂️ **Folder & Sequence Naming** – Define the exact folder + 3-digit sequence for downloads (e.g., `Grok/demo/007`)
- 💾 **One-click Download** – Saves the MP4 and metadata JSON together, requesting HD when available
- ♻️ **Local Caching** – Each `/imagine/post/...` page keeps its latest prompt/status for easy revisit
- 🗃️ **Favorites Organization** – Categorize and filter your favorite generated images directly on the Grok Imagine favorites page.

> ⚠️ This build intentionally removes the on-page editor, preset management, and theme controls. Use the [full edition](https://github.com/OtokoNoIzumi/grok_spirit) or the Web Store release if you need those features.

## 🪶 Edition Overview 

This No-Editor Edition is tailored for two reliable workflows:

1. **Inspect prompts** – When Grok completes a video, the panel shows the captured JSON (read-only) plus status/time metadata.
2. **Replay prompts** – Edit JSON externally, copy it, then press **Clipboard**; Grok’s textarea updates instantly, ready to regenerate.

The panel also exposes two text inputs (folder + sequence) so downloads land exactly where you expect—e.g., `Grok/my-project/007.mp4` and the matching `.json`.

## 🚀 Quick Start

### Chrome Web Store Installation (Full Edition / Legacy UI)

> Prefer the classic UI with built-in editor panels? Install the official release from the Chrome Web Store.

[Install full edition](https://chromewebstore.google.com/detail/logaoplejbodjhnogdndgllocmpmlako)

### Local Installation (This No-Editor Build)

1. **Download Project**
   ```bash
   git clone https://github.com/OtokoNoIzumi/grok_spirit.git
   # or download the ZIP and extract
   ```
2. **Load Extension**
   - Open Chrome and visit `chrome://extensions/`
   - Enable “Developer mode” in the top-right corner
   - Click “Load unpacked”
   - Select this repository folder
3. **Start Using (manual load required)**
   - Visit `grok.com/imagine`
   - The Grok Spirit panel will appear automatically with the captured prompt

## 📖 Usage Guide

### Minimal Workflow (Clipboard Driven)

1. Generate a video on `grok.com/imagine`.
2. Once the request finishes, the panel shows the captured JSON plus a status chip (processing/failed/completed).
3. To change the prompt, copy it into your favorite editor, tweak it, then copy the new JSON back to your clipboard.
4. Click **Clipboard** in the panel; the textarea on Grok updates immediately so you can press Generate.
5. Fill in `Folder` and `Sequence`, then click **Download** to save `Grok/<folder>/<sequence>.{mp4,json}` (HD requested automatically when possible).

> 💡 All prompt editing happens outside Grok in this build; the panel only handles display, injection, and downloads.

### Clipboard Tips

- Accepts plain text, structured JSON, or multi-locale JSON (the `en` branch is injected).
- After injection, Grok treats the text as if you pasted it manually, so you can instantly generate again.

## 🎬 Video Metadata Processing

A companion Python tool helps batch-process downloaded MP4/meta files:

### What it does
- **Metadata embedding** – Uses FFmpeg to embed JSON metadata into MP4 files
- **Smart renaming** – Groups videos by prompt and assigns priority/version labels
- **Batch processing** – Handles entire directories at once

### Quick setup
1. **Prerequisites**: Python 3.10+, FFmpeg
2. **Install deps**:
   ```bash
   cd grok_video_processor
   pip install -r requirements.txt
   ```
3. **Run**:
   ```bash
   python meta_video.py
   ```

### File organization
- Groups similar prompts
- Creates priority numbers (P1, P2, …) and version numbers (v1, v2, …)
- Final naming example: `grok_video_[uuid]_P1_v1.mp4`

**📖 Full documentation**: see [`grok_video_processor/README.md`](grok_video_processor/README.md).

## 🤝 Contributing

1. Fork this repo
2. Create a feature branch `git checkout -b feature/AmazingFeature`
3. Commit your changes `git commit -m 'Add some AmazingFeature'`
4. Push to the branch `git push origin feature/AmazingFeature`
5. Open a Pull Request

## 📄 License

MIT License – see [LICENSE](LICENSE).

## 🙏 Acknowledgments

- [Grok](https://grok.com/) – A powerful AI video generation platform
- Chrome extension developer community – Inspiration and guidance
- [@nmsbnmsb1](https://github.com/nmsbnmsb1) – Early dark-mode ideas and contributions

## 📈 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=OtokoNoIzumi/grok_spirit&type=Date)](https://star-history.com/#OtokoNoIzumi/grok_spirit&Date)
