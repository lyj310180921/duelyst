# 为 OpenDuelyst 做出贡献

感谢您有兴趣为 OpenDuelyst 做出贡献！
本文档将向您介绍代码并指导您进行更改。

## 目录

- [有用的网址](#helpful-links)
- [代码结构](#code-structure)
- [搭建开发环境](#dev-environment)
- [本地启动游戏](#starting-the-game)
- [常见故障排除步骤](#troubleshooting)
- [进行应用程序（前端）更改](#frontend-changes)
- [进行服务器/工作线程（后端）更改](#backend-changes)
- [打开拉取请求](#pull-requests)
- [版本控制](#versioning)
- [从哪里获得帮助](#get-help)

## 有用的网址 <a id="helpful-links" />

- [OpenDuelyst 路线图](ROADMAP.md)
- [架构文档](ARCHITECTURE.md)
- [开放式问题](https://github.com/open-duelyst/duelyst/issues)
- [Node.js v16 API 参考](https://nodejs.org/dist/latest-v16.x/docs/api/)
- [Redis 文档](https://redis.io/docs/)
- [Postgres v14 文档](https://www.postgresql.org/docs/14/index.html)
- [Firebase API 参考（前端）](https://firebase.google.com/docs/reference/node/)
- [Firebase API 参考（后端）](https://firebase.google.com/docs/reference/admin/node/)
- [Socket.io v4 文档](https://socket.io/docs/v4/)
- [JSON Web 令牌文档](https://jwt.io/)
- [Mocha 单元测试 API 参考](https://mochajs.org/api/)
- [Chai 断言 API 参考](https://www.chaijs.com/api/)

## 代码结构 <a id="code-structure" />

代码的深入解释可以在上面的架构文档中找到。 它包含一些指向每个服务或组件使用的代码中特定位置的指针。

为了帮助您更快地熟悉，这里列出了开发游戏时常用的文件和目录：

- `app/` 包含前端/游戏客户端的代码
- `config/` 包含后端服务的配置
- `docker-compose.yaml` 包含我们的 Docker 容器配置
- `docs` 包含文档，包括本指南
- `gulp/` 和 `gulpfile.babel.js` 包含工作流程自动化，适用于诸如
构建代码
- `package.json` 包含我们的 Node.js 依赖项
- `server` 包含 HTTP API 服务器和 WebSocket 游戏服务器的代码
- `terraform` 包含用于配置暂存和生产的代码
环境
- `test` 包含单元测试和集成测试
- `worker` 包含用于异步处理的工作程序的代码
后台工作

#### 代码风格和 Linting

对于 JavaScript 代码，我们使用 ESLint 来强制代码风格。
它的配置可以在`.eslintrc.json`中找到。
您可以使用`yarn lint:js`运行 linter。
您可以通过运行`yarn format:js`自动格式化 JS 代码以满足这些标准。

对于 CoffeeScript 代码，我们使用 CoffeeLint 来强制代码风格。
它的配置可以在 `coffeelint.json` 中找到。
您可以使用`yarn lint:coffee`、`yarn lint:coffee:app`或`yarn lint:coffee:backend`运行 linter。

#### 关于 JavaScript、CoffeeScript 和 TypeScript

大部分代码是用 CoffeeScript 编写的，它会编译成 JavaScript。 我们正在考虑用 JavaScript 替换 CoffeeScript

(请参阅 [Issue #4](https://github.com/open-duelyst/duelyst/issues/4)).

我们还应该考虑尽可能转向 TypeScript。
存储库中有一个相当严格的`tsconfig.json`，它已针对新代码进行了预先配置。 编写新的 TypeScript 代码后，您可以运行 `yarn tsc` 使用此配置来构建它。

## 搭建开发环境 <a id="dev-environment" />

#### 安装系统依赖项

在开始之前，您需要 Node.js 和 [Docker Desktop](https://www.docker.com/products/docker-desktop/)
这些将使您能够在容器中运行代码，并与 javaScript 构建过程进行交互。

我们建议使用以下方式安装 Node.js [Volta](https://volta.sh/), 它可以帮助您管理 Node.js 版本。 我们使用 Node 的最新 LTS 版本，目前是 v18。

一旦你有了`npm`，你就可以用它来安装 Yarn（我们使用的包管理器）：

```bash
npm install -g yarn@1
npm install -g cross-env
```

在继续之前，请禁用已弃用的“git://”协议来获取包：
```
git config --global url."https://".insteadOf git://
```

#### 安装 Node.js 依赖项

安装 Yarn 后，您可以安装游戏的依赖项。 在存储库根目录中运行以下命令：

```bash
yarn install --dev  # Install remaining Node.js dependencies.
yarn tsc:chroma-js  # Compile TypeScript dependencies.
```

#### 设置 Firebase

为了成功运行游戏，您需要
[Firebase Realtime Database](https://firebase.google.com/docs/database/).

幸运的是，Google 提供了该服务的免费版本，称为
["Spark Pricing Plan"](https://firebase.google.com/docs/projects/billing/firebase-pricing-plans).

创建 Firebase (Google) 帐户、Firebase 项目和 Firebase 实时数据库。 请务必在美国中部地区创建实时数据库，因为欧洲和新加坡地区将为您提供与我们的 Firebase 客户端不兼容的 URL。

创建 Firebase 帐户和实时数据库后，记下实时数据库的 URL，因为您在构建代码时需要它。 您还需要为数据库配置安全规则。 您可以从以下位置复制这些内容 [firebaseRules.json](../firebaseRules.json) 在仓库中。

#### 构建代码

现在依赖项已安装，您可以构建游戏代码及其资产。 此步骤将需要几分钟。

```
cross-env FIREBASE_URL=<YOUR_FIREBASE_URL> yarn build
```

包含 Firebase URL 很重要，因为它使游戏客户端能够与服务器进行通信。 实时数据库首页有一个链接按钮，可以点击复制正确的URL； 不要复制并粘贴地址。 我们希望在首页上提供 URl； 它应该看起来像'https://[name_of_database]-default-rtdb.firebaseio.com/".

初始构建后，您可以使用`yarn build:app`（仅代码；无资产）`yarn build:web`（仅限前端 HTML/CSS/JS）来节省时间。

## 本地启动游戏 <a id="starting-the-game" />

#### 附加 Firebase 配置

现在您已经设置了开发环境，还需要更多的 Firebase 配置。 在 Firebase 项目设置页面中，点击“服务帐户”选项卡。

首先，单击“Database Secrets”并创建一个新的旧令牌。
在存储库根目录中创建一个名为“.env”的文件，其中包含以下内容：

```bash
FIREBASE_URL=<YOUR_FIREBASE_URL>
FIREBASE_LEGACY_TOKEN=<YOUR_FIREBASE_LEGACY_TOKEN>
```

接下来，仍然在 Firebase“服务帐户”页面上，单击“服务帐户”弹出窗口以打开 Google Cloud。 创建一个能够读取和写入 Firebase 的新服务帐户。 您可以通过使用“Firebase 实时数据库管理员”角色来实现此目的，但您可能希望稍后对此进行限制。

在 Google“服务帐户”页面上，单击新创建的服务帐户旁边的“管理密钥”将允许您创建新的 JSON 密钥。 执行此操作，并将其保存为存储库根目录中的`serviceAccountKey.json`

注意：此存储库的 Git 会忽略`.env`和`serviceAccountKey.json`，因此不会意外提交这些机密。

#### 启用商城

如果您想启用商店，请设置值
`/system-status/shop_enabled` 在 Firebase 中设置为`true`。 完成此操作后，商店将出现在主菜单中。

#### 从 Docker 开始

现在游戏已经构建完毕，Firebase 也已配置，您可以在本地启动服务器并玩游戏了。 我们用
[Docker Compose](https://docs.docker.com/compose/) 管理游戏服务器、Redis 缓存和 Postgres 数据库的容器。

作为启动游戏服务器之前的最后一步，必须初始化 Postgres 数据库。 为此，请运行`docker compose up migrate`。

现在您可以运行`docker compose up`来启动游戏服务器及其依赖项。

一旦您在日志中看到`Duelyst 'development' started on port 3000`，服务器就准备好了！ 在浏览器中打开http://localhost:3000/ 加载客户端，创建用户并玩练习游戏。

## 常见故障排除步骤 <a id="troubleshooting" />

在浏览器中加载 Duelyst 后，有两个关键位置需要监控：

1. 浏览器控制台，它将转发应用程序生成的所有错误。将其过滤为仅`警告`和`错误`日志级别将使内容更具可读性。

2. Docker Compose 的控制台输出，它将多路复用所有游戏容器的日志输出。 特别要注意任何错误堆栈跟踪，这些跟踪很难错过，因为它们跨越多行并打破了典型的日志格式。

来自这两个来源的错误应该为您提供可供参考的文件和行号。 如果没有，您通常可以搜索错误字符串以找出代码中错误的根源。 有些错误源自我们的依赖项，因此如果您在跟踪某些内容时遇到困难，还可以在`node_modules/`目录中搜索错误字符串。

## 进行应用程序（前端）更改 <a id="frontend-changes" />

现在您已经设置了完整的开发环境，您可以尝试对游戏客户端进行更改。 为此，请编辑`app/`目录中所需的任何代码、卡片或资源。
完成后，再次构建游戏：

```
FIREBASE_URL=<YOUR_FIREBASE_URL> yarn build
```

您现在可以再次运行`docker compose up`并加载客户端来测试您的更改。

## 进行服务器/工作线程（后端）更改 <a id="backend-changes" />

在处理服务器或工作线程代码时，您不需要重建游戏。 相反，只需再次运行`docker compose up`，然后加载游戏客户端来测试您的更改。

不要忘记使用 `yarn test:unit` 运行单元测试，并使用 `yarn test:integration` 运行集成测试。 如果您发现未更改的代码测试失败，请提交新的`bug`问题。

## 打开拉取请求 <a id="pull-requests" />

准备好贡献后，您可以打开拉取请求以对其进行审核。

首先，在 Github 上分叉 OpenDuelyst，并将您的分支推送到分叉。 然后，登录 Github 后，系统会在查看 OpenDuelyst 存储库时提示您打开拉取请求。

如果贡献解决了一个未解决的问题，您可以在合并 PR 时自动关闭该问题。 为此，请在 PR 描述中包含文本“关闭 #1234”（以自动关闭问题 #1234）。

当您打开拉取请求时，一些任务将在我们的持续集成 (CI) 环境中自动启动，以检查和测试代码。

我们使用 [Github Actions](https://github.com/features/actions) 进行ci, 因此您可以在拉取请求本身中看到这些任务的状态和结果。

一旦 PR 被审核并接受，它将被合并到`main`分支中。 至此，您已经是一名 OpenDuelyst 开发人员了。 恭喜！

## 版本 <a id="versioning" />

OpenDuelyst 使用 [Semantic Versioning](https://semver.org/) 其发布.
在版本`1.96.17`中，`1`是`MAJOR`版本，`96`是`MINOR`版本，`17`是`PATCH`版本。

对于 OpenDuelyst，`MAJOR`版本不应超过`1`。 请注意，`1.99`之后的立即版本是`1.100`，而不是`2.0.0`。

## 从哪里获得帮助 <a id="get-help" />

目前，您可以通过提出问题来获得有关 OpenDuelyst 的帮助。 由于这是一个志愿者项目，因此可能需要几天时间才会有人查看您的问题。

您还可以加入 [OpenDuelyst Discord server](https://discord.gg/HhUWfZ9cxe)
进行技术讨论和支持。
