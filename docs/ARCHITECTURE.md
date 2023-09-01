# Duelyst Service Architecture

![Service Architecture Diagram](diagrams/services.png)

## 客户端架构

游戏客户端是一个在浏览器中运行的 Backbone.js + Marionette 应用程序。 代码可以在`app/`中找到，配置可以在`app/common/config.js`中找到。

以 HTML 形式渲染客户端的游戏引擎是 [Cocos2d-JS (vs 3.3)](https://docs.cocos.com/cocos2d-x/manual/en/)

## 服务器架构

Duelyst 的后端主要由四个 CoffeeScript 服务组成：

API Server:

- API 服务器是一个 Express.js 应用程序，用于处理游戏客户端的路由。
- 该服务将用户和游戏数据存储在 Postgres 和 Redis 中。
- 该服务默认侦听端口 3000，并在默认路由上为浏览器客户端提供服务。
- 代码可以在`server/api.coffee`中找到，配置可以在`config/`中找到。

Game Server:

- 游戏服务器是一个处理多人游戏的 Socket.io WebSocket 服务器。
- 该服务将任务放入 Redis 中以供workers拾取。
- 该服务默认侦听端口 8001。
- 代码可以在`server/game.coffee`中找到，配置可以在`config/`中找到.

Single Player (SP) Server:

- SP 服务器是一个处理单人游戏的 Socket.io WebSocket 服务器。
- 该服务将任务放入 Redis 中以供workers拾取。
- 该服务默认侦听端口 8000。
- 代码可以在`server/single_player.coffee`中找到，配置可以在`config/`中找到.

Worker:

- Worker使用 Kue 轮询 Redis 支持的队列以执行游戏创建和匹配等任务.
- 一些匹配任务还使用 Postgres 来进行服务器运行状况检查和检索机器人用户。
- 代码可以在`worker/worker.coffee`中找到，配置可以在`config/`中找到。
- Kue GUI 可通过`docker compose upworker-ui`在`http://localhost:4000`获得。

## 其他依赖项

Firebase 实时数据库：

- 为游戏客户端提供一种访问永久和瞬态数据的方法，而无需直接访问Postgres，例如传输游戏步骤。
- 客户端代码可以在`app`（参见`new Firebase()`调用）和`server/lib/duelyst_firebase_module.coffee`中找到，配置可以在`config/`中找到

Postgres:

- 存储用户、已完成的游戏、数据库迁移等的关系数据
- 客户端代码可以在`server/lib/data_access/knex.coffee`和`server/knexfile.js`中找到，配置可以在`config/`中找到
- 可以通过`docker compose up migrate`运行迁移
- 可以通过`docker compose up adminer`在`http://localhost:8080`获取管理 UI

Redis:

- 用作 Kue 任务的后备队列，以及匹配、游戏管理、玩家队列等
- 客户端代码可以在`server/redis/index.coffee`中找到，配置可以在`config/`中找到

Consul:

- 单服务器部署中不需要，但历史上用于服务发现、匹配和观察
- 客户端代码可以在`server/lib/consul.coffee`中找到，配置可以在`config/`中找到

AWS S3:

- 为通用文件存储提供二进制大对象 (blob) 存储。
- 目前未使用，但代码可用于使用 S3 进行 CDN、未完成的游戏存档、客户端日志记录和数据库备份功能。

## 资源利用率 <a id="resource-utilization" />

以下资源利用率数据是由 Docker 在本地测量的。 基线数据是在闲置时测量的，峰值和每场游戏的数据是在玩练习游戏时测量的（其执行与 Game WebSocket 服务器相同的工作，加上 AI 决策的计算工作）。

#### Node.js processes (API, Game, SP, Worker):

- CPU：0-1% 基线； API 负载峰值达到 15-65%； AI 处理后 SP 飙升至 5%。
  - 注意：负载期间的 API 峰值主要是由于从 Express 而不是 CDN 提供 75MB 的静态资源。
- 内存：300MB 基线。 随着时间的推移，API 会增加到约 500MB。
- 网络：接近零基线。
	- API 每个游戏发送约 500KB。
	- 每场游戏和 SP 发送约 200KB。
	- Worker 的基线是 1-2KB/s（内部、未计费流量）。
		- 这种持续的流量是由于 Kue 轮询造成的； 请参阅`server/redis/r-jobs.coffee`.
- 存储：约5GB（2.0GB用于操作系统基线，1.3GB用于`app/`，0.8GB用于`node_modules/`，0.5GB用于`dist/`）

#### Postgres database:

- CPU：接近零基线。 用户检索（登录等）达到 7%
- 内存：20MB 基线。 登录并玩游戏后增加至 70MB（缓存）
- 网络：接近零基线。 发送有关用户操作（获取用户、挑战、卡片等）的 10-15KB（内部、未计费流量）
- 存储：约 1GB（0.5GB 用于操作系统基准，0.1GB 用于`/var/lib/postgresql`，约 5 个用户，约 20 个游戏）

#### Redis cache:

- CPU：1% 基线。 游戏期间保持在 2% 以下。
	- Redis 6.x 有第二个线程用于连接处理，但在我们的小规模下，我们并没有从中受益匪浅。
- 内存：4MB 基线； 玩本地单人游戏时小于 5MB。
- 网络：1KB/s 基线。 每个游戏的发送量低于 1MB（内部、未计费流量）。
	- 这种持续的流量是由于 Kue 轮询造成的； 请参阅 `server/redis/r-jobs.coffee`。
- 存储：200MB 以下。

#### 250 个并发、10 分钟游戏使用的总资源（125 MP、125 SP）:

- vCPU：大约10个（其中一半是API和Worker）
- 内存：大约 2GB（尽管更多会提高缓冲区/缓存效率）
- 网络：总体约300 KB/s； 250 款游戏总计 175MB（每款游戏 700KB）
- 存储：每个服务位于不同实例上大约 22GB。
