const generateImage = require('./generate-image')

class PluginOptions {
  constructor(options) {
    // default value for plugin options
    this.asSubcommand = false
    this.disableCQCode = false
    this.maxLength = 42
    this.defaultOffsetX = 200
    this.maxOffsetX = 1000

    // write user plugin options
    for (let key in options) {
      if (Reflect.has(this, key)) this[key] = options[key]
    }

    // check boundary conditions
    if (isNaN(this.defaultOffsetX)) this.defaultOffsetX = 200
    if (this.defaultOffsetX < 0) this.defaultOffsetX = 0

    if (isNaN(this.maxOffsetX)) this.maxOffsetX = 1000
    if (this.maxOffsetX < 0) this.maxOffsetX = 0

    if (!this.asSubcommand) this.asSubcommand = false
  }
}

module.exports.name = 'gosen-choyen'

module.exports.apply = (ctx, pluginOptions) => {
  let pOptions = new PluginOptions(pluginOptions)
  let logger = ctx.logger('gosen-choyen')

  let thisCommand

  if (pOptions.asSubcommand) {
    thisCommand = ctx
      .command(pOptions.asSubcommand)
      .subcommand('5k <upper> <lower>', '生成5000兆円风格字体')
  } else {
    thisCommand = ctx
      .command('5k <upper> <lower>', '生成5000兆円风格字体')
  }

  thisCommand
    .usage('若upper或lower为""可使其为空；含有空格或以-开头的内容需要用""包围起来。')
    .option('offset', '-x <px> 设置第二行偏移量（默认为200px）')
    .option('reserve', '-r 保留CQ码')
    .example('5k 5000兆円 欲しい！  生成字体图')
    .action(async ({ session, options }, upper, lower) => {
      logger.debug('plugin toggled.')

      // disableCQcode
      if (pOptions.disableCQCode) options.reserve = false

      // maxLength
      options.maxLength = pOptions.maxLength

      // defaultOffsetX & maxOffsetX
      let lowerOffsetX = !isNaN(options.offset) ? options.offset : pOptions.defaultOffsetX
      if (lowerOffsetX < 0) lowerOffsetX = 0
      if (lowerOffsetX > pOptions.maxOffsetX) lowerOffsetX = pOptions.maxOffsetX
      options.lowerOffsetX = lowerOffsetX

      const canvas = generateImage(session, options, upper, lower)

      if (canvas) {
        canvas.toBuffer((err, buffer) => {
          try {
            if (err) throw err
            let content = buffer.toString('base64')
            session.$send(`[CQ:image,file=base64://${content}]`)
            logger.info('image is sent.')
          } catch (err) {
            if (err) console.log(err)
            logger.warn('something went wrong when sending image.')
          }
        })
      } else {
        logger.warn('arguments or options are incorrect.')
      }

    })
}