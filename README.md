# 🎨 Grok Spirit · No-Editor Edition

*Grok Imagine companion extension*

**Current mainline:** this repo ships the Grok Spirit **“No-Editor Edition”**, focusing on favorites management, clipboard injection, prompt capture, and download utilities. It does *not* bundle an in-page visual editor. Build prompts with any JSON editor or AI tool using the templates in `docs/`.

<div align="center">

> Need the classic multi-panel editor? Check the full repo: [Grok Spirit (Full)](https://github.com/OtokoNoIzumi/grok_spirit) or install the Chrome Web Store build.
>
> [English](https://github.com/OtokoNoIzumi/grok_spirit/blob/main/README.md) | [中文](https://github.com/OtokoNoIzumi/grok_spirit/blob/main/README_zh.md)
>
> [![Chrome Web Store](https://img.shields.io/chrome-web-store/v/logaoplejbodjhnogdndgllocmpmlako?label=Chrome%20Web%20Store&color=blue)](https://chromewebstore.google.com/detail/logaoplejbodjhnogdndgllocmpmlako)
> [![Chrome Web Store Users](https://img.shields.io/chrome-web-store/users/logaoplejbodjhnogdndgllocmpmlako?label=Active%20Users&color=green)](https://chromewebstore.google.com/detail/logaoplejbodjhnogdndgllocmpmlako)
> [![GitHub stars](https://img.shields.io/github/stars/OtokoNoIzumi/grok_spirit?color=yellow&label=GitHub%20Stars)](https://github.com/OtokoNoIzumi/grok_spirit/stargazers)
> [![GitHub license](https://img.shields.io/github/license/OtokoNoIzumi/grok_spirit?color=blue)](https://github.com/OtokoNoIzumi/grok_spirit/blob/main/LICENSE)
> [![GitHub last commit](https://img.shields.io/github/last-commit/OtokoNoIzumi/grok_spirit)](https://github.com/OtokoNoIzumi/grok_spirit/commits)
>
> **A Chrome extension for managing Grok Imagine favorites, generating videos, capturing prompts, and downloading everything together.**
>
> ![Grok Spirit Screenshot](https://otokonoizumi.github.io/media/grok%20spirit.png)
>
> [🏪 Store (Full Version)](https://chromewebstore.google.com/detail/logaoplejbodjhnogdndgllocmpmlako) · [📋 Usage Guide](#使用说明) · [🛠️ Local Install](#本地安装简化版) · [❓ Issues](https://github.com/OtokoNoIzumi/grok_spirit/issues)

</div>

---

## ✨ Highlights (no built-in editor)

- 🗃️ **Favorites organization** – categorize and filter generated images directly inside the Grok Imagine favorites page.
- 📋 **Clipboard injection** – read text/JSON from the clipboard and push it back into the Grok input box. For full-structure references, see the [structured prompt research & injection guide](https://otokonoizumi.github.io/Diary/grok_imagen_research).
- 🔎 **Prompt capture** – automatically log the original prompt whenever a video finishes successfully.
- 💾 **Video + metadata download** – grab structured data when available (fallback to plain prompt otherwise).
- 🗂️ **Folder & sequence naming** – define download paths like `Grok/demo/007` to keep assets tidy.
- 💾 **One-click download** – save MP4 plus metadata JSON together, requesting HD when possible.
- 🎬 **Batch metadata tooling** – includes a Python helper for processing downloaded assets.

---

## 🚀 Quick Start

### Local install (simplified)

1. **Clone the project**
   ```bash
   git clone https://github.com/nmsbnmsb1/grok_spirit.git
   # or download ZIP and extract
   ```
2. **Load the extension**
   - Open Chrome → `chrome://extensions/`
   - Enable “Developer mode” (top right)
   - Click “Load unpacked”
   - Select this repo folder
3. **Use it**
   - Visit `grok.com/imagine`
   - The panel shows up automatically with the captured prompt JSON

## 📖 Usage

### Structured prompt note
- Due to Grok backend changes, **new video responses no longer contain the hidden JSON structure—only the raw prompt**. Only historical/legacy sessions still expose structured fields. For official structures and injection samples, see the [research doc](https://otokonoizumi.github.io/Diary/grok_imagen_research).

---

### Minimal workflow
1. Generate a video on `grok.com/imagine`.
2. Once the request finishes, the panel shows the captured JSON and the status tag (processing/failed/completed).
3. Need edits? Copy the JSON to an external editor, tweak it, then copy it back.
4. Hit **Clipboard** in the panel to push the content into Grok’s input box, then click Generate.
5. Fill in “Folder” + “Sequence”, press Download, and you’ll get `Grok/<folder>/<sequence>.{mp4,json}` (HD when available).

### Clipboard tips

- Supports plain text, single-language JSON, or multi-language JSON with an `en` field (the `en` value is injected first).
- After injection it behaves exactly like manual paste—you can continue with Grok’s native UI immediately.

## 🎬 Video metadata tooling (unchanged from full version)

A bundled Python utility helps batch-process downloaded MP4 + meta files:

### Capabilities
- **Metadata embedding** – use FFmpeg to write JSON metadata into MP4 files.
- **Smart renaming** – organize files by prompt group and version automatically.
- **Batch runs** – process entire directories in one go.

### Getting started
1. **Requirements**: Python 3.10+, FFmpeg
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
- Group by similar prompts
- Generate priority labels (P1, P2, …) and version tags (v1, v2, …)
- Sample name: `grok_video_[uuid]_P1_v1.mp4`

**📖 Detailed docs**: see [`grok_video_processor/README_zh.md`](grok_video_processor/README_zh.md).

## 🤝 Contributing

Contributions welcome:

1. Fork this repo
2. Create a branch `git checkout -b feature/AmazingFeature`
3. Commit `git commit -m 'Add some AmazingFeature'`
4. Push `git push origin feature/AmazingFeature`
5. Open a Pull Request

## 📄 License

MIT License – see [LICENSE](LICENSE).

## 🙏 Thanks

- [Grok](https://grok.com/) – the AI video platform this extension supports
- Chrome extension community – for docs and inspiration
- [@nmsbnmsb1](https://github.com/nmsbnmsb1) – dark mode and other early contributions

## 📈 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=OtokoNoIzumi/grok_spirit&type=Date)](https://star-history.com/#OtokoNoIzumi/grok_spirit&Date)
