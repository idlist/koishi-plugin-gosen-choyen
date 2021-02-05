const generateImage = require('./generate-image')

class PluginOptions {
  constructor(pOptions) {
    // default value for plugin options
    this.version = 2
    this.asSubcommand = pOptions.asSubcommand ?? false
    this.disableCQCode = false
    this.maxLength = 42
    this.defaultOffsetX = 200
    this.maxOffsetX = 1000

    // write user plugin options
    for (let key in pOptions) {
      if (Reflect.has(this, key)) this[key] = pOptions[key]
    }

    // check boundary conditions
    if (isNaN(this.defaultOffsetX)) this.defaultOffsetX = 200
    if (this.defaultOffsetX < 0) this.defaultOffsetX = 0

    if (isNaN(this.maxOffsetX)) this.maxOffsetX = 1000
    if (this.maxOffsetX < 0) this.maxOffsetX = 0

    if ([2, 3].indexOf(this.version) == -1) this.version = 0
  }
}

class Options {
  constructor(options, pOptions) {
    // disableCQcode -> reserve
    this.reserve = options.reserve ?? false
    if (pOptions.disableCQCode) this.reserve = false

    // maxLength
    this.maxLength = pOptions.maxLength

    // defaultOffsetX & maxOffsetX -> lowerOffsetX
    let lowerOffsetX = !isNaN(options.offset) ? options.offset : pOptions.defaultOffsetX
    if (lowerOffsetX < 0) lowerOffsetX = 0
    if (lowerOffsetX > pOptions.maxOffsetX) lowerOffsetX = pOptions.maxOffsetX
    this.lowerOffsetX = lowerOffsetX
  }
}

class Content {
  constructor(options, upper, lower) {
    this.errCode = 0

    if (upper == undefined) upper = ''
    if (lower == undefined) lower = ''

    upper = upper == undefined ? '' : upper.toString()
    lower = lower == undefined ? '' : lower.toString()

    const clearCQCode = (str) => {
      return str.replace(/\[CQ:.+\]/g, '')
    }

    if (options.reserve !== true) {
      upper = clearCQCode(upper).trim()
      lower = clearCQCode(lower).trim()
    }

    if (!upper && !lower) {
      this.errCode = 1
    }

    if (upper.length > options.maxLength || lower.length > options.maxLength) {
      this.errCode = 2
    }

    if (!this.errCode) {
      this.upper = upper
      this.lower = lower
    }
  }
}

module.exports.name = 'gosen-choyen'

module.exports.apply = (ctx, pluginOptions) => {
  let pOptions = new PluginOptions(pluginOptions)
  let logger = ctx.logger('gosen-choyen')

  let thisCommand = ctx
    .command('5k <upper> <lower>', '生成5000兆円风格字体')
    .usage('若upper或lower为""可使其为空；含有空格或以-开头的内容需要用""包围起来。')
    .option('offset', '-x <px> 设置第二行偏移量（默认为200px）')
    .option('reserve', '-r 保留CQ码')
    .example('5k 5000兆円 欲しい！  生成字体图')

  // version
  switch (pOptions.version) {
  case 2:
    thisCommand.action(async ({ session, options }, upper, lower) => {
      logger.debug('plugin toggled.')

      // initialize options
      options = new Options(options, pOptions)

      // manipulate content
      const content = new Content(options, upper, lower)
      if (content.errCode) {
        logger.warn('arguments or options are incorrect.')
        switch (content.errCode) {
        case 1:
          session.$send('没识别到内容。')
          return
        case 2:
          session.$send('内容太长了。')
          return
        }
      }

      // generate and send image
      const canvas = generateImage(options, content.upper, content.lower)
      try {
        const imageData = canvas.toBuffer().toString('base64')
        logger.info('image sent.')
        session.$send(`[CQ:image,file=base64://${imageData}]`)
      } catch (err) {
        logger.warn('something went wrong when sending image.')
      }
    })
    break
  case 3:
    thisCommand.action(async ({ options }, upper, lower) => {
      logger.debug('plugin toggled.')

      // initialize options
      options = new Options(options, pOptions)

      // manipulate content
      const content = new Content(options, upper, lower)
      if (content.errCode) {
        logger.warn('arguments or options were incorrect.')
        switch (content.errCode) {
        case 1:
          return '没识别到内容。'
        case 2:
          return '内容太长了。'
        }
      }

      // generate and send image
      const canvas = generateImage(options, content.upper, content.lower)
      try {
        const imageData = canvas.toBuffer().toString('base64')
        logger.info('image sent.')
        return `[CQ:image,file=base64://${imageData}]`
      } catch (err) {
        logger.warn('something went wrong when sending image.')
      }
    })
    break
  default:
    logger.error('version is not correct or supported. gosen-choyen is disposed.')
    ctx.command('5k').dispose()
    break
  }

  // asSubcommand
  if (pOptions.version && pOptions.asSubcommand) {
    ctx.command(pOptions.asSubcommand).subcommand('5k')
  }
}