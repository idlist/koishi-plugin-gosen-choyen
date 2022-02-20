# koishi-plugin-gosen-choyen

[![npm](https://img.shields.io/npm/v/koishi-plugin-gosen-choyen?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-gosen-choyen)
[![npm-download](https://img.shields.io/npm/dw/koishi-plugin-gosen-choyen?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-gosen-choyen)

一个用于 **[Koishi v4](https://github.com/koishijs/koishi)** 的生成 **5000 兆円欲しい！** （想要五千兆円！）风格的插件。

微调自这个 [5000Choyen](https://github.com/yurafuca/5000choyen)，图片的生成使用了 [skia-canvas](https://github.com/samizdatco/skia-canvas)。

## 效果图

<img width='200px' src='./examples/git_is_hard.png'>

<img width='200px' src='./examples/nantong.png'>

图中使用的字体为思源黑体 Heavy 和思源宋体 Heavy。

## 安装方法

你需要安装 [koishi-plugin-canvas](https://github.com/idlist/koishi-plugin-canvas) 作为 [服务](https://koishi.js.org/guide/plugin/service.html) 依赖。

```shell
npm i koishi-plugin-canvas koishi-plugin-gosen-choyen
```

然后在配置文件或入口文件中将插件添加至你的机器人中。

## 使用方法

```
5k <upper> <lower> [-x <px>] [-r]
```

**upper**：上行文字

**lower**：下行文字

需要两行文字的其中一行不为空才会生成图片。

| 可选选项 | 默认值 | 说明 |
| - | - | - |
| `-x, --offset` | 200 (`defaultOffsetX`) | 设置第二行偏移量，单位为 px |
| `-r, --reserve` | `false` | 保留 CQ 码 |

## 插件配置项

这个插件需要配置以下配置项：

| 配置项 | 默认值 | 说明 |
| - | - | - |
| `upper` | `{}` | 上行文字使用的字体配置 **\*1** |
| `lower` | `{}` | 下行文字使用的字体配置 **\*1** |

**\*1** 有两种配置方式：

1. 配置字体文件相对路径：

```js
{
  path: './path/to/font/file'    // 字体文件相对工作目录的路径
}
```

或者

```js
{
  path: 'C://path/to/font/file' // 字体文件的绝对路径
}
```

2. 配置字体名字与字重：

```js
{
  name: 'my-font',              // 字体名
  weight: 'normal'              // 字重
}
```

同时，也提供了一些可能会用到的可选配置项：

| 配置项 | 默认值 | 说明 |
| - | - | - |
| `disableCQCode` | `false` | 是否强制清除 CQ 码，`true` 时将覆盖 `--reserve` |
| `maxLength` | 42 | 一行文字的最长文字数 |
| `defaultOffsetX` | 200 | 第二行的默认偏移量，单位为 `px`，最小取 0 |
| `maxOffsetX` | 1000 | 第二行的最大偏移量，即 `--offset` 的最大值，最小取 0 |

## Q&A

- 我想要某个选项（比如缩放字体）

建议`git clone`这个仓库然后自己拿去改一改，代码真的很简单的！

- 发现了个 bug

这很正常。

## 更新记录

### 2.0.2

- 修复了某处的一个 `logger` 输出问题。

- ### 2.0.1

修复文档。

### 2.0.0

- 对 v4 做了一个很简陋的适配，同时从 node-canvas 迁移到了 skia-canvas。如果仍然需要用 v3 请使用 1.0 版本。

### 1.1.0

- 取消了 `asSubcommand` 配置项，请使用 `ctx.command` 进行复写以实现相同的效果。
- 将字体文件的配置项抽了出来，现在这个插件本身没有那么大了。

### 1.0.3

- 修了点 bug 和与预期不符的行为。

### 1.0.0

- 默认的 Koishi 版本被修改为为 Koishi v3，同时删掉了一些冗杂的日志（logger）信息。

  若有需要，推荐使用 Koishi 自带的日志来进行行为的记录，例如把 command 行为的日志等级设置为 3（debug）。
