# 构建和测试 Docker 镜像

用于启动和管理容器的 Dockerfile ,脚本位于`docker/`目录中。

## 本地开发

使用`docker compose up`，它将使用`docker/start.sh`脚本来运行 Yarn 脚本。

## 测试容器构建

构建容器镜像：
```
# <service> should be one of ('api', 'game', 'sp', 'worker')
# <version> should match the latest git release; defaults to 'testing'
scripts/build_container.sh <service> <version>
```

测试容器镜像：
```
# This should successfully start the SP server.
# Ctrl-C should successfully terminate the container.
docker run -it duelyst-sp
```

## 将容器发布到 ECR

标记并发布容器镜像：
```
# <service> should be one of ('api', 'game', 'sp', 'worker')
# <version> should match the latest git release
# <registry> is your AWS ECR registry alias
# <repo> is your AWS ECR repository name
scripts/publish_container.sh <service> <version> <registry> <repo>
```

## 关于镜像尺寸的注意事项

我们使用一些策略来保持较小的镜像尺寸：

1. 使用替代基本映像，即`node:18-slim`而不是`node:18`
2. 避免在容器构建中安装 Node.js `devDependency`
3. 从容器构建中清除 Yarn 缓存

#### 基础镜像对比

Sizes of Docker images built by `scripts/build_container.sh`:

| Service | Image          | Size    | ECR Size | 50 GB Limit |
|---------|----------------|---------|----------|-------------|
| Node.js | node:18        | 942 MB  | N/A      | N/A         |
| Node.js | node:18-slim   | 234 MB  | N/A      | N/A         |
| Node.js | node:18-alpine | 165 MB  | N/A      | N/A         |
| Node.js | node:16        | 858 MB  | N/A      | N/A         |
| Node.js | node:16-slim   | 174 MB  | N/A      | N/A         |
| Node.js | node:16-alpine | 114 MB  | N/A      | N/A         |
| API     | node:18        | 1170 MB | 425 MB   | 117 / 23 ea |
| API     | node:18-slim   | 767 MB  | 254 MB   | 196 / 39 ea |
| API     | node:18-alpine | 626 MB  | 187 MB   | 267 / 53 ea |
| API     | node:16        | 1040 MB | 396 MB   | 126 / 25 ea |
| API     | node:16-slim   | 615 MB  | 214 MB   | 233 / 46 ea |
| API     | node:16-alpine | 530 MB  | 169 MB   | 295 / 59 ea |

Image sizes reported by `docker image ls` include all layers, and are much
higher than the image sizes reported by ECR. ECR gives us 50 GB of storage
for free, so the 50 GB Limit column shows how many total images we can store
for each image, and how many we can store for each of the five services we
build.

The `-alpine` images pull Node.js builds from unofficial-builds.nodejs.org,
while the default and `-slim` images pull official builds from nodejs.org.
While the `-slim` images are 25-35% larger than the `-alpine` images, they're
still small enough to allow us to store several dozen versions in ECR before we
start to approach the 50 GB ECR limit. Additionally, the `-slim` images are
based on Debian, which comes with a more familiar toolchain.

Similarly, Node.js v18 images are 10-20% larger than Node.js v16 images, but we
may be able to get some of this size back by replacing Mocha, Axios, and other
dependencies with their new native counterparts in Node.js v18.

#### Regarding `bcrypt`

We could further reduce image sizes by removing the `bcrypt` dependencies from
the base image layer. These currently include `python3`, `make`, `gcc`, and
`g++`. The `bcrypt` dependency is only used by the API service, during the
login flow in `server/routes/session.coffee`. One option here could be to move
authentication flows (such as JWT signing, granting, and validation) to their
own microservice to isolate this dependency, reducing the image size of all
other services.
