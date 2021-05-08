# koishi-plugin-gosen-choyen

[![npm](https://img.shields.io/npm/v/koishi-plugin-gosen-choyen?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-gosen-choyen)
[![npm-download](https://img.shields.io/npm/dw/koishi-plugin-gosen-choyen?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-gosen-choyen)

一个用于 **[Koishi v3 / v2](https://github.com/koishijs/koishi)** 的生成 **5000兆円欲しい！** （想要五千兆円！）风格的插件。

微调自这个[5000Choyen](https://github.com/yurafuca/5000choyen)，图片的生成使用了[node-canvas](https://github.com/Automattic/node-canvas)。

## 效果图

<img width='200px' src='./examples/git_is_hard.png'>

<img width='200px' src='./examples/nantong.png'>


## 安装方法

```shell
npm i koishi-plugin-gosen-choyen
```

然后参照 [安装插件](https://koishi.js.org/guide/context.html#%E5%AE%89%E8%A3%85%E6%8F%92%E4%BB%B6) 继续安装。

## 使用方法

```
5k <upper> <lower> [-x <px>] [-r]
```

**upper**：上行文字

**lower**：下行文字

需要两行文字的其中一行不为空才会生成图片。

| 可选选项        | 默认值                 | 说明                        |
| --------------- | ---------------------- | --------------------------- |
| `-x, --offset`  | 200 (`defaultOffsetX`) | 设置第二行偏移量，单位为 px |
| `-r, --reserve` | `false`                | 保留 CQ 码                  |

## 插件配置项

这个插件无需任何配置项即可使用，同时也提供了一些可能会用到的配置项。一些不太可能会用到的配置项就摸了。

| 配置项           | 默认值  | 说明                                                         |
| ---------------- | ------- | ------------------------------------------------------------ |
| `version`        | 3       | Koishi的版本，可选 2 或 3                                    |
| `asSubcommand`   | `false` | 若为字符串，则将此指令作为子指令注册到该指令之下 **\*1**；否则注册为普通指令 |
| `disableCQCode`  | `false` | 是否强制清除CQ码，`true` 时将覆盖 `--reserve`                |
| `maxLength`      | 42      | 一行文字的最长文字数                                         |
| `defaultOffsetX` | 200     | 第二行的默认偏移量，最小取 0                                 |
| `maxOffsetX`     | 1000    | 第二行的最大偏移量，即 `--offset` 的最大值，最小取 0         |

**\*1**: 由于 Koishi 注册指令名的机制，若需要使用这个配置项，请先注册作为主指令的指令，再注册 gosen-choyen。

## Q&A

- 为什么我卡在这一步？

```shell
> canvas@2.6.1 install E:\dev\koishi-plugin-gosen-choyen\node_modules\canvas
> node-pre-gyp install --fallback-to-build

node-pre-gyp WARN Using needle for node-pre-gyp https download
```

这是因为你正在国内使用npm，而needle在国内是几乎下载不动的。

建议使用科学上网，或者提前使用其他国内镜像源安装node-canvas或是其中的二进制文件，比如下面这条：

```shell
npm i canvas --canvas_binary_host_mirror=https://npm.taobao.org/mirrors/node-canvas-prebuilt/
```

- 我想要某个选项（比如缩放字体）

建议`git clone`这个仓库然后自己拿去改一改，代码真的很简单的！

- 发现了个bug

这很正常。

## 更新记录

### 1.0.3

修了点 bug 和与预期不符的行为。

### 1.0

默认的 Koishi 版本被修改为为 Koishi v3，同时删掉了一些冗杂的日志（logger）信息。

若有需要，推荐使用 Koishi 自带的日志来进行行为的记录，例如把 command 行为的日志等级设置为 3（debug）。