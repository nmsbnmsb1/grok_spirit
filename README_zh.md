# 🎨 Grok Spirit · 无编辑器版

*Grok Imagine 辅助扩展*

**当前主线：** 本仓库发布的是 Grok Spirit **「无编辑器版」**，聚焦收藏夹管理、剪贴板注入、提示捕获与下载管理，不包含站内可视化编辑器。提示词可以根据 docs 目录下的模版文件，使用 JSON编辑器 或者 其他AI 生成。

<div align="center">

> 如果需要经典的多面板编辑器，请查阅完整版本仓库：[Grok Spirit 完整版](https://github.com/OtokoNoIzumi/grok_spirit) 或使用 Chrome 商店中的版本。
>
> [English](https://github.com/OtokoNoIzumi/grok_spirit/blob/main/README.md) | [中文](https://github.com/OtokoNoIzumi/grok_spirit/blob/main/README_zh.md)
>
> [![Chrome Web Store](https://img.shields.io/chrome-web-store/v/logaoplejbodjhnogdndgllocmpmlako?label=Chrome%20商店版本&color=blue)](https://chromewebstore.google.com/detail/logaoplejbodjhnogdndgllocmpmlako)
> [![Chrome Web Store Users](https://img.shields.io/chrome-web-store/users/logaoplejbodjhnogdndgllocmpmlako?label=活跃用户&color=green)](https://chromewebstore.google.com/detail/logaoplejbodjhnogdndgllocmpmlako)
> [![GitHub stars](https://img.shields.io/github/stars/OtokoNoIzumi/grok_spirit?color=yellow&label=GitHub%20Stars)](https://github.com/OtokoNoIzumi/grok_spirit/stargazers)
> [![GitHub license](https://img.shields.io/github/license/OtokoNoIzumi/grok_spirit?color=blue)](https://github.com/OtokoNoIzumi/grok_spirit/blob/main/LICENSE)
> [![GitHub last commit](https://img.shields.io/github/last-commit/OtokoNoIzumi/grok_spirit)](https://github.com/OtokoNoIzumi/grok_spirit/commits)
>
> **一个 Chrome 扩展，用于在 Grok Imagine 管理收藏夹照片，生成视频，捕获视频提示词并下载**
>
> ![Grok Spirit 功能截图](https://otokonoizumi.github.io/media/grok%20spirit.png)
>
> [🏪 商店（完整版）](https://chromewebstore.google.com/detail/logaoplejbodjhnogdndgllocmpmlako) · [📋 使用说明](#使用说明) · [🛠️ 本地安装](#本地安装简化版) · [❓ 问题反馈](https://github.com/OtokoNoIzumi/grok_spirit/issues)

</div>
---

## ✨ 功能特点（无内置编辑器）

- 🗃️ **收藏夹整理** – 直接在 Grok Imagine 收藏夹页面对您喜爱的生成图片进行分类和筛选设置。
- 📋 **剪贴板注入** — 读取剪贴板文本/JSON 并回填至 Grok 输入框。若需要参考/自定义完整结构，可访问[结构prompt研究与注入指南](https://otokonoizumi.github.io/Diary/grok_imagen_research)。
- 🔎 **提示捕获**：自动记录每次成功生成视频时的原始提示词
- 💾 **视频及元数据下载** — 支持下载带结构数据（有则显、无则普通prompt）。
- 🗂️ **文件夹 & 序号命名**：自定义下载路径（如 `Grok/demo/007`）保持素材有序
- 💾 **一键下载**：同时保存 MP4 与 metadata JSON，若可用会优先请求 HD 版本
- 🎬 **批量元数据处理** — 内附Python元数据批处理工具。

---

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

### 关于结构化提示
- 由于Grok服务端策略变化，**新生成视频API结果中已无隐藏JSON结构，只提供原始提示**。只有历史/老会话还能读取结构化字段并编辑。如需查询官方结构与注入示例，可访问[结构提示词研究文档](https://otokonoizumi.github.io/Diary/grok_imagen_research)。
---
### 最简流程
1. 在 `grok.com/imagine` 生成视频。
2. 面板会在请求完成后显示捕获到的 JSON 与状态标签（processing/failed/completed）。
3. 需要修改时，将 JSON 复制到外部编辑器处理，再复制回剪贴板。
4. 点击面板中的 **Clipboard**，内容会自动写入 Grok 输入框，可直接点击 Generate。
5. 填写「文件夹」「序号」，再点击 Download，可得到 `Grok/<文件夹>/<序号>.{mp4,json}`（若可用将下载 HD）。

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
