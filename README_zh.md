<div align="center">

# 🎨 Grok Spirit

*Grok Imagen 参数编辑器 - Chrome扩展*

[English](README.md) | [中文](README_zh.md)

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/logaoplejbodjhnogdndgllocmpmlako?label=Chrome%20商店版本&color=blue)](https://chromewebstore.google.com/detail/logaoplejbodjhnogdndgllocmpmlako)
[![Chrome Web Store Users](https://img.shields.io/chrome-web-store/users/logaoplejbodjhnogdndgllocmpmlako?label=活跃用户&color=green)](https://chromewebstore.google.com/detail/logaoplejbodjhnogdndgllocmpmlako)
[![GitHub stars](https://img.shields.io/github/stars/OtokoNoIzumi/grok_spirit?color=yellow&label=GitHub%20Stars)](https://github.com/OtokoNoIzumi/grok_spirit/stargazers)
[![GitHub license](https://img.shields.io/github/license/OtokoNoIzumi/grok_spirit?color=blue)](https://github.com/OtokoNoIzumi/grok_spirit/blob/main/LICENSE)
[![GitHub last commit](https://img.shields.io/github/last-commit/OtokoNoIzumi/grok_spirit)](https://github.com/OtokoNoIzumi/grok_spirit/commits)

**一个Chrome扩展，用于显示和编辑Grok Imagen提示参数**

![Grok Spirit 功能截图](https://otokonoizumi.github.io/media/grok%20spirit.png)

[🏪 Chrome商店安装](https://chromewebstore.google.com/detail/logaoplejbodjhnogdndgllocmpmlako) · [📋 使用说明](#使用说明) · [🛠️ 本地安装](#本地安装) · [❓ 问题反馈](https://github.com/OtokoNoIzumi/grok_spirit/issues)

</div>

---

## ✨ 功能特点

- 🔎 **提示捕获** - 自动记录每个完成视频使用的原始 JSON 结构
- 📋 **剪贴板注入** - 一键读取剪贴板中的文本/JSON 并写入 Grok 输入框
- 🗂️ **文件夹与序号** - 自定义下载文件夹与 3 位序号，保持素材整齐
- 💾 **一键下载** - MP4 与元数据 JSON 同步下载并使用统一命名
- ♻️ **本地缓存** - 每个 `/imagine/post/...` 页面都会保留最近一次的提示与状态

## 🪶 最简版本说明

当前仓库提供的是 Grok Spirit 的「最简面板」构建。  
它舍弃了早期的多段式参数编辑器，专注在两个最常用的动作：

1. **查看提示**：视频渲染完成后，面板会展示捕获到的 JSON（只读）及对应状态/时间。
2. **复用提示**：在外部编辑器修改 JSON，复制后点击面板里的 **Clipboard**，内容就会自动写入 Grok 的输入框，随时再次生成。

面板额外提供「文件夹」「序号」两个输入框，用于决定下载文件的路径，例如 `Grok/作品集/007.mp4` 与 `Grok/作品集/007.json`。

## 🚀 快速开始

### Chrome商店安装（主线版本）

> Chrome 商店提供的是经典/主线版本。当前仓库的最简版本 **未上架** 商店，如需主线版本可继续使用商店链接。

[安装主线版本](https://chromewebstore.google.com/detail/logaoplejbodjhnogdndgllocmpmlako)

### 本地安装（最简版本）

1. **下载项目**
   ```bash
   git clone https://github.com/OtokoNoIzumi/grok_spirit.git
   # 或下载ZIP文件并解压
   ```

2. **加载扩展**
   - 打开Chrome浏览器，访问 `chrome://extensions/`
   - 开启右上角的"开发者模式"
   - 点击"加载已解压的扩展程序"
   - 选择项目目录

3. **开始使用（需手动加载）**
   - 访问 grok.com/imagine
   - 扩展将自动激活并显示 Grok Spirit 提示面板

## 📖 使用说明

### 最简流程

1. 在 `grok.com/imagine` 生成视频，Grok Spirit 会在请求完成时捕获 JSON 并显示在面板中。
2. 在只读文本框里查看完整结构，顶部状态会提示是处理中、失败还是完成。
3. 如需修改，复制 JSON 到任意编辑器调整，再复制回来点击 **Clipboard**，内容会写入 Grok 的输入框。
4. 填写「文件夹」「序号」，扩展会记住这些值并用于之后的下载。
5. 点击「Download」，即可按照 `Grok/<文件夹>/<序号>.{mp4,json}` 的规则下载视频和元数据（如可用会优先请求 HD）。

### 剪贴板提示

- 支持纯文本、标准 JSON 或带多语言的 JSON（`en` 字段会注入到 Grok）。
- 写入后等同于手动粘贴，可直接点击 Grok 自带的「Generate」。

## 🎬 视频元数据处理

我做了一个Python工具进行后期meta文件和视频的批量处理：

### 功能说明
- **元数据嵌入**: 使用FFmpeg将JSON元数据嵌入到MP4文件中
- **智能重命名**: 按提示组和版本自动组织文件
- **批量处理**: 一次性处理整个目录的下载视频

### 快速设置
1. **前置要求**: Python 3.10+, FFmpeg
2. **安装**:
   ```bash
   cd grok_video_processor
   pip install -r requirements.txt
   ```
3. **使用**:
   ```bash
   python meta_video.py
   ```

### 文件组织
工具会自动组织您的下载视频：
- 按相似提示分组视频
- 分配优先级编号（P1, P2等）
- 在组内添加版本号（v1, v2等）
- 最终格式：`grok_video_[uuid]_P1_v1.mp4`

**📖 详细文档**: 查看 [`grok_video_processor/README_zh.md`](grok_video_processor/README_zh.md) 获取完整的设置和使用说明。

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT License 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

感谢以下开源项目和开发者的启发与帮助：

- [Grok](https://grok.com/) - 提供了强大的AI图像生成平台
- Chrome扩展开发社区 - 为扩展开发提供了丰富的资源和指导
- [@nmsbnmsb1](https://github.com/nmsbnmsb1) - 暗色模式实现的初始想法和贡献

## 📈 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=OtokoNoIzumi/grok_spirit&type=Date)](https://star-history.com/#OtokoNoIzumi/grok_spirit&Date)
