# 构建桌面客户端

## 一次性设置

使用 `npm install -g cross-env` 安装 `cross-env`，用于支持除了 Mac 和 Linux 系统外，还支持在 Windows 系统上运行以下步骤。

在 Mac 或 Linux 上，安装 Wine 以启用构建 Windows 桌面客户端。 在 Mac 上，使用`brew install --cask wine-stable`。

## 构建 JavaScript 客户端

桌面版本将引入 JavaScript 客户端代码，因此我们将首先构建它。 这些命令应从项目根目录运行。

1. 使用`yarn install --include=dev`安装应用程序依赖项。
2. 使用`cross-env NODE_ENV=staging FIREBASE_URL=FOO API_URL=BAR yarn build`构建应用程序。 `FIREBASE_URL` 应该有一个尾部斜杠，而 `API_URL` 不应该有。

完成此操作后，编译后的应用程序将位于`dist/src/`中。

## 构建桌面客户端

这些命令应该从`desktop/`目录运行，该目录有自己的依赖项和脚本。

1. 使用`yarn install --include=dev`安装桌面依赖项。
2. 运行 `yarn build:all` 来构建临时客户端。 要构建生产客户端，请使用 `yarn build:all:product`。 客户端将位于`dist/build`中。
3. 要运行新建的应用程序，请使用 `yarn start:mac`、`yarn:start:linux` 或 `yarn start:windows`。
4. 运行 `yarn zip:all` 以压缩所有可用的桌面客户端。

## 已知的问题

- Linux 构建依赖于`libgconf-2-4`包。
