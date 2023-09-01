# OpenDuelyst

![Duelyst Logo](app/resources/ui/brand_duelyst.png)

这是 Duelyst 的源代码，这是一款回合制卡牌游戏。
由 Counterplay Games 开发并于 2016 年发布的回合制策略混合游戏。

## Production Deployment

目前正在进行将 OpenDuelyst 部署为“Duelyst Classic”的工作：
游戏与 v1.96.17 中服务器关闭之前一模一样。正在跟踪此情况 [issue #3](https://github.com/open-duelyst/duelyst/issues/3).

## Staging Deployment

暂存部署已在 https://staging.duelyst.org 上启动并运行。 两个都
有单人游戏和多人游戏可供选择。

## Downloading the Desktop Clients

适用于 Windows、Mac 和 Linux 的桌面客户端可以在
[Releases](https://github.com/open-duelyst/duelyst/releases) 页面下载.

桌面客户端当前使用暂存环境。 他们将使用
生产环境一旦可用。

## Playing on Android or iOS

目前我们对在移动网络上玩游戏有基本的支持。 从您的手机上
浏览器，前往 https://staging.duelyst.org 进行尝试。

要在 Chrome 或 Safari 中隐藏状态/导航栏，请打开游戏并选择“添加到主屏幕”。 当您从主屏幕打开游戏时，状态栏将被隐藏。

## Contributing to OpenDuelyst

如果您想为 OpenDuelyst 做出贡献，请查看我们的
[Documentation](docs/README.md), 尤其是 [Roadmap](docs/ROADMAP.md) 和
[Contributor Guide](docs/CONTRIBUTING.md).

您还可以加入 OpenDuelyst 开发者 Discord 服务器[here](https://discord.gg/HhUWfZ9cxe). 这个Discord服务器专注于OpenDuelyst的开发，并有前端、后端和基础设施讨论的频道，但它对任何人开放。

## Filing Issues and Reporting Bugs

如果您遇到错误并想要报告它，请首先检查
[Open Issues](https://github.com/open-duelyst/duelyst/issues/) 查看该错误是否已被报告。 如果没有，请随意创建一个带有“bug”标签的新问题。

如果您想请求技术功能或对代码进行增强，您可以使用`enhancement`标签创建一个新问题。

由于 OpenDuelyst 目前专注于重新创建 v1.96.17 中最后存在的游戏，因此请避免创建与平衡更改相关的功能请求。

## Localization

该游戏目前包括英语和德语本地化。 如果您想贡献其他语言的翻译，请查看`app/localization/locales`目录。 您可以复制“en”文件夹并开始更新新语言的字符串，然后提交包含您的贡献的 Pull 请求。

大约有 4,500 个本地化字符串，因此也可以一次完成一点。 一旦翻译完成，我们就可以帮助将语言包含在游戏中。

## License

OpenDuelyst 根据知识共享零 v1.0 通用许可证获得许可。 您可以查看许可证副本 [here](LICENSE).
