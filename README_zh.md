<div align="center">

# 🎨 Grok Spirit · 无编辑器版

*Grok Imagen 参数捕获与下载辅助扩展*

> **当前主线：** 本仓库发布的即是 Grok Spirit **「无编辑器版」**，聚焦提示捕获、剪贴板注入与下载管理，不包含站内可视化编辑器。提示词可以根据 docs 目录下的模版文件，使用 JSON编辑器 或者 其他AI 生成。

> 如果需要经典的多面板编辑器，请查阅完整版本仓库：[Grok Spirit 完整版](https://github.com/OtokoNoIzumi/grok_spirit) 或使用 Chrome 商店中的版本。

[English](https://github.com/OtokoNoIzumi/grok_spirit/README.md) | [中文](https://github.com/OtokoNoIzumi/grok_spirit/README_zh.md)

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/logaoplejbodjhnogdndgllocmpmlako?label=Chrome%20商店版本&color=blue)](https://chromewebstore.google.com/detail/logaoplejbodjhnogdndgllocmpmlako)
[![Chrome Web Store Users](https://img.shields.io/chrome-web-store/users/logaoplejbodjhnogdndgllocmpmlako?label=活跃用户&color=green)](https://chromewebstore.google.com/detail/logaoplejbodjhnogdndgllocmpmlako)
[![GitHub stars](https://img.shields.io/github/stars/OtokoNoIzumi/grok_spirit?color=yellow&label=GitHub%20Stars)](https://github.com/OtokoNoIzumi/grok_spirit/stargazers)
[![GitHub license](https://img.shields.io/github/license/OtokoNoIzumi/grok_spirit?color=blue)](https://github.com/OtokoNoIzumi/grok_spirit/blob/main/LICENSE)
[![GitHub last commit](https://img.shields.io/github/last-commit/OtokoNoIzumi/grok_spirit)](https://github.com/OtokoNoIzumi/grok_spirit/commits)

**一个 Chrome 扩展，用于捕获 Grok Imagen 视频提示并简化下载流程**

![Grok Spirit 功能截图](https://otokonoizumi.github.io/media/grok%20spirit.png)

[🏪 商店（完整版）](https://chromewebstore.google.com/detail/logaoplejbodjhnogdndgllocmpmlako) · [📋 使用说明](#使用说明) · [🛠️ 本地安装](#本地安装简化版) · [❓ 问题反馈](https://github.com/OtokoNoIzumi/grok_spirit/issues)

</div>

---

## ✨ 功能特点（无内置编辑器）

- 🔎 **提示捕获**：自动记录每次成功生成视频时的原始 JSON/结构化数据
- 📋 **剪贴板注入**：读取剪贴板文本/JSON 并回填至 Grok 输入框，方便在外部工具中编辑
- 🗂️ **文件夹 & 序号命名**：自定义下载路径（如 `Grok/demo/007`）保持素材有序
- 💾 **一键下载**：同时保存 MP4 与 metadata JSON，若可用会优先请求 HD 版本
- ♻️ **本地缓存**：每个 `/imagine/post/...` 页面保留最近一次状态，随时回溯

> ⚠️ 本版本不包含站内结构化编辑等功能。如需完整 UI，请改用 [完整版仓库](https://github.com/OtokoNoIzumi/grok_spirit) 或 Chrome 商店版本。

## 🪶 版本说明

本版专注两条核心流程：

1. **查看提示**：视频完成时，面板展示捕获到的 JSON（只读）与进度、时间信息。
2. **复用提示**：在任意文本编辑器修改 JSON，复制后点击面板中的 **Clipboard**，即可把内容写回 Grok 输入框继续生成。

面板还提供「文件夹」「序号」两个输入框，决定下载保存路径，例如 `Grok/作品集/007.mp4` 及同名 JSON。

## 🚀 快速开始

### 本地安装（当前简化版）

1. **下载项目**
   ```bash
   git clone https://github.com/nmsbnmsb1/grok_spirit.git
   # 或下载 ZIP 并解压
   ```
2. **加载扩展**
   - 打开 Chrome，访问 `chrome://extensions/`
   - 开启右上角「开发者模式」
   - 点击「加载已解压的扩展程序」
   - 选择本仓库目录
3. **开始使用（需手动加载）**
   - 访问 `grok.com/imagine`
   - 面板会自动出现并显示提示 JSON

## 📖 使用说明

### 最简流程

1. 在 `grok.com/imagine` 生成视频。
2. 面板会在请求完成后显示捕获到的 JSON 与状态标签（processing/failed/completed）。
3. 需要修改时，将 JSON 复制到外部编辑器处理，再复制回剪贴板。
4. 点击面板中的 **Clipboard**，内容会自动写入 Grok 输入框，可直接点击 Generate。
5. 填写「文件夹」「序号」，再点击 Download，可得到 `Grok/<文件夹>/<序号>.{mp4,json}`（若可用将下载 HD）。

> 💡 本版本所有参数编辑均在浏览器外完成，面板仅负责展示、注入与下载。

### 剪贴板提示

- 支持纯文本、单语言 JSON 或带 `en` 字段的多语言 JSON（会优先注入 `en`）。
- 注入后与手动粘贴无异，可立刻使用 Grok 原生界面发起生成。

## 🎬 视频元数据处理 (完整版自带，未改动)

我做了一个 Python 工具方便批量处理下载的 MP4 与 meta 文件：

### 功能简介
- **元数据嵌入**：使用 FFmpeg 将 JSON 元数据写入 MP4
- **智能重命名**：按提示组与版本自动组织文件
- **批量处理**：一次性处理整个目录

### 快速开始
1. **环境要求**：Python 3.10+，FFmpeg
2. **安装依赖**：
   ```bash
   cd grok_video_processor
   pip install -r requirements.txt
   ```
3. **运行**：
   ```bash
   python meta_video.py
   ```

### 文件整理
- 按相似提示分组
- 生成优先级（P1、P2…）与版本号（v1、v2…）
- 最终命名示例：`grok_video_[uuid]_P1_v1.mp4`

**📖 详细文档**：参见 [`grok_video_processor/README_zh.md`](grok_video_processor/README_zh.md)。

## 🤝 贡献指南

欢迎提交改进：

1. Fork 本仓库
2. 创建分支 `git checkout -b feature/AmazingFeature`
3. 提交更改 `git commit -m 'Add some AmazingFeature'`
4. 推送分支 `git push origin feature/AmazingFeature`
5. 提交 Pull Request

## 📄 许可证

本项目采用 MIT License，详见 [LICENSE](LICENSE)。

## 🙏 致谢

- [Grok](https://grok.com/) — 强大的 AI 视频生成平台
- Chrome 扩展开发者社区 — 提供丰富的资料与灵感
- [@nmsbnmsb1](https://github.com/nmsbnmsb1) — 暗色模式与多项早期贡献

## 📈 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=OtokoNoIzumi/grok_spirit&type=Date)](https://star-history.com/#OtokoNoIzumi/grok_spirit&Date)
