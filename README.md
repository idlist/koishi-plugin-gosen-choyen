# koishi-plugin-gosen-choyen

一个用于 **[Koishi v2 / v3](https://github.com/koishijs/koishi)** 的生成 **5000兆円欲しい！** （想要五千兆円！）风格的插件。

微调自这个[5000Choyen](https://github.com/yurafuca/5000choyen)，图片的生成使用了[node-canvas](https://github.com/Automattic/node-canvas)。

## 效果图

<img width='200px' src='./examples/git_is_hard.png'>

<img width='200px' src='./examples/nantong.png'>


## 安装方法

```shell
npm i koishi-plugin-gosen-choyen
```

然后，在 **koishi.config.js** 中：

```js
module.exports = {
  plugins: [
    // your other plugins...
    ['gosen-choyen'],
  ],
  // other configs...
]
```

或者在 **index.js** 中：

```js
app.plugin(require('koishi-plugin-gosen-choyen'))
```

## 使用方法

```
5k <upper> <lower> [-x <px>] [-r]
```

**upper**：上行文字

**lower**：下行文字

需要两行文字的其中一行不为空才会生成图片。

| 可选选项        | 默认值                 | 说明                       |
| --------------- | ---------------------- | -------------------------- |
| `-x, --offset`  | 200 (`defaultXOffset`) | 设置第二行偏移量，单位为px |
| `-r, --reserve` | `false`                | 保留CQ码                   |

## 插件配置项

| 配置项           | 默认值  | 说明                                                         |
| ---------------- | ------- | ------------------------------------------------------------ |
| `version`        | 2       | Koishi的版本，可选2或3。                                     |
| `asSubcommand`   | `false` | 若为字符串，则将此指令作为子指令注册到该指令之下；否则注册为普通指令。 |
| `disableCQCode`  | `false` | 是否强制清除CQ码，`true`时将覆盖`--reserve`                  |
| `maxLength`      | 42      | 一行文字的最长文字数                                         |
| `defaultOffsetX` | 200     | 第二行的默认偏移量，最小取0                                  |
| `maxOffsetX`     | 1000    | 第二行的最大偏移量，即`--offset`的最大值，最小取0            |

## Q&A

- **为什么我卡在这一步？**

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

- **我想要【某个选项】（比如缩放字体）**

建议`git clone`这个仓库然后自己拿去改一改，代码真的很简单的！

- **发现了个bug**

这很正常。
