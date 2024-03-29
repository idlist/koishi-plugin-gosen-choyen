const { access } = require('fs/promises')
const { resolve } = require('path')
const { cwd } = require('process')
const { segment } = require('koishi')
const generateImage = require('./generate-image')


module.exports.name = 'gosen-choyen'

module.exports.using = ['canvas']

/**
 * @param {import('koishi').Context} ctx
 * @param {import('./index').ConfigObject} config
 */
module.exports.apply = async (ctx, config) => {
  const logger = ctx.logger('gosen-choyen')

  try {
    // Require for checking and type linting
    require('koishi-plugin-canvas')
  } catch {
    logger.warn('Dependency plugin koishi-plugin-canvas is not installed, disposed.')
    return
  }

  config = {
    disableCQCode: false,
    maxLength: 42,
    defaultOffsetX: 200,
    maxOffsetX: 1000,
    fonts: {},
    fontsPath: {},
    ...config,
  }

  const upperFormat = { font: '', weight: 'normal' }
  const lowerFormat = { font: '', weight: 'normal' }

  try {
    await access(config.upper.path)

    let path
    if (config.upper.path.startsWith('./')) {
      path = resolve(cwd(), config.upper.path)
    } else {
      path = config.upper.path
    }

    ctx.canvas.registerFont(path, {
      family: '5k-upper',
      weight: upperFormat.weight,
    })
    upperFormat.font = '5k-upper'
  } catch {
    logger.debug('The font path for upper text does not exists.')
  }

  try {
    await access(config.lower.path)

    let path
    if (config.lower.path.startsWith('./')) {
      path = resolve(cwd(), config.lower.path)
    } else {
      path = config.lower.path
    }

    ctx.canvas.registerFont(path, {
      family: '5k-lower',
      weight: lowerFormat.weight,
    })
    lowerFormat.font = '5k-lower'
  } catch {
    logger.debug('The font path for lower text does not exists.')
  }

  if (config.upper.name) upperFormat.font = config.upper.name
  if (config.upper.weight) upperFormat.weight = config.upper.weight
  if (config.lower.name) lowerFormat.font = config.lower.name
  if (config.lower.weight) lowerFormat.weight = config.lower.weight

  if (!upperFormat.font || !lowerFormat.font) {
    logger.error('Fonts are not provided. disposed.')
    return
  }

  ctx.command('5k <upper> <lower>', '生成5000兆円风格字体')
    .usage('若upper或lower为""可使其为空；含有空格或以-开头的内容需要用""包围起来。')
    .option('offset', '-x <px> 设置第二行偏移量（默认为200px）')
    .option('reserve', '-r 保留CQ码')
    .example('5k 5000兆円 欲しい！  生成字体图')
    .action(async ({ session, options }, upper, lower) => {
      /**
       * @type {import('./index').ImageGeneratorOptions}
       */
      const parsed = {
        reserve: options.reserve ?? false,
        maxLength: config.maxLength,
        offsetX: !isNaN(options.offset) ? options.offset : config.defaultOffsetX,
        upper: { ...upperFormat },
        lower: { ...lowerFormat },
      }

      if (config.disableCQCode) options.reserve = false
      if (parsed.offsetX < 0) parsed.offsetX = 0
      if (parsed.offsetX > config.maxOffsetX) parsed.offsetX = config.maxOffsetX

      const validateInput = str => {
        return (typeof str == 'undefined')
          ? ''
          : str.toString().trim().replace(/\r\n/g, ' ')
      }

      const clearCQCode = str => {
        return str.replace(/\[CQ:.+\]/g, '')
      }

      if (parsed.reserve !== true) {
        upper = clearCQCode(upper)
        lower = clearCQCode(lower)
      }

      upper = segment.unescape(validateInput(upper))
      lower = segment.unescape(validateInput(lower))

      if (!upper && !lower) {
        return session.execute('help 5k')
      }

      if (upper.length > parsed.maxLength || lower.length > parsed.maxLength) {
        return '内容太长了。'
      }

      const canvas = generateImage(ctx.canvas, upper, lower, parsed)

      try {
        const imageData = canvas.toBase64()
        return segment('image', { url: `base64://${imageData}` })
      } catch (err) {
        logger.warn('Ssomething went wrong when sending image.')
        logger.warn(err)
      }
    })
}
