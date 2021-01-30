const { createCanvas, registerFont } = require('canvas')
const { CQCode } = require('koishi-utils')

registerFont('./fonts/shsans_heavy.otf', { family: 'shsans', weight: 'heavy' })
registerFont('./fonts/shserif_bold.otf', { family: 'shserif', weight: 'bold' })

const clearCQCode = str => {
  return str.replace(/\[CQ:.+\]/g, '')
}

module.exports = (session, options, upper, lower) => {
  // content manipulation
  if (upper == undefined) upper = ''
  if (lower == undefined) lower = ''

  if (options.reserve !== true) {
    upper = clearCQCode(upper).trim()
    lower = clearCQCode(lower).trim()
  }

  if (!upper && !lower) {
    session.$send('没识别到内容。')
    return
  }

  if (upper.length > options.maxLength || lower.length > options.maxLength) {
    session.$send('内容太长了。')
    return
  }

  let upperText = CQCode.unescape(upper)
  let lowerText = CQCode.unescape(lower)

  // canvas setting
  const canvas = createCanvas()
  const ctx = canvas.getContext('2d')

  ctx.font = '100px shsans'
  const upperWidth = ctx.measureText(upperText).width
  ctx.font = '100px shserif'
  const lowerWidth = ctx.measureText(lowerText).width
  const offsetWidth = options.lowerOffsetX

  canvas.height = 270
  canvas.width = Math.max(upperWidth + 80, lowerWidth + offsetWidth + 70)
  ctx.lineJoin = 'round'
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.setTransform(1, 0, -0.4, 1, 0, 0)

  // define auxillary variables
  let posx, posy, grad

  // generate upper text
  ctx.font = '100px shsans'
  posx = 70
  posy = 100

  ctx.strokeStyle = '#000'
  ctx.lineWidth = 18
  ctx.strokeText(upperText, posx + 4, posy + 3)

  grad = ctx.createLinearGradient(0, 24, 0, 122)
  grad.addColorStop(0.0, 'rgb(0,15,36)')
  grad.addColorStop(0.10, 'rgb(255,255,255)')
  grad.addColorStop(0.18, 'rgb(55,58,59)')
  grad.addColorStop(0.25, 'rgb(55,58,59)')
  grad.addColorStop(0.5, 'rgb(200,200,200)')
  grad.addColorStop(0.75, 'rgb(55,58,59)')
  grad.addColorStop(0.85, 'rgb(25,20,31)')
  grad.addColorStop(0.91, 'rgb(240,240,240)')
  grad.addColorStop(0.95, 'rgb(166,175,194)')
  grad.addColorStop(1, 'rgb(50,50,50)')
  ctx.strokeStyle = grad
  ctx.lineWidth = 17
  ctx.strokeText(upperText, posx + 4, posy + 3)

  ctx.strokeStyle = '#000000'
  ctx.lineWidth = 10
  ctx.strokeText(upperText, posx, posy)

  grad = ctx.createLinearGradient(0, 20, 0, 100)
  grad.addColorStop(0, 'rgb(253,241,0)')
  grad.addColorStop(0.25, 'rgb(245,253,187)')
  grad.addColorStop(0.4, 'rgb(255,255,255)')
  grad.addColorStop(0.75, 'rgb(253,219,9)')
  grad.addColorStop(0.9, 'rgb(127,53,0)')
  grad.addColorStop(1, 'rgb(243,196,11)')
  ctx.strokeStyle = grad
  ctx.lineWidth = 8
  ctx.strokeText(upperText, posx, posy)

  ctx.lineWidth = 4
  ctx.strokeStyle = '#000'
  ctx.strokeText(upperText, posx + 2, posy - 2)

  ctx.lineWidth = 4
  ctx.strokeStyle = '#FFFFFF'
  ctx.strokeText(upperText, posx, posy - 2)

  grad = ctx.createLinearGradient(0, 20, 0, 100)
  grad.addColorStop(0, 'rgb(255, 100, 0)')
  grad.addColorStop(0.5, 'rgb(123, 0, 0)')
  grad.addColorStop(0.51, 'rgb(240, 0, 0)')
  grad.addColorStop(1, 'rgb(5, 0, 0)')
  ctx.lineWidth = 1
  ctx.fillStyle = grad
  ctx.fillText(upperText, posx, posy - 2)

  grad = ctx.createLinearGradient(0, 20, 0, 100)
  grad.addColorStop(0, 'rgb(230, 0, 0)')
  grad.addColorStop(0.5, 'rgb(230, 0, 0)')
  grad.addColorStop(0.51, 'rgb(240, 0, 0)')
  grad.addColorStop(1, 'rgb(5, 0, 0)')
  ctx.strokeStyle = grad
  ctx.strokeText(upperText, posx, posy - 2)

  // generate lower text
  ctx.font = '100px shserif'
  let offsetX = offsetWidth
  let offsetY = 130
  posx = offsetX + 130
  posy = offsetY + 100

  ctx.strokeStyle = '#000'
  ctx.lineWidth = 17
  ctx.strokeText(lowerText, posx + 4, posy + 3)

  grad = ctx.createLinearGradient(0 + offsetX, 20 + offsetY, 0 + offsetX, 118 + offsetY)
  grad.addColorStop(0, 'rgb(0,15,36)')
  grad.addColorStop(0.25, 'rgb(250,250,250)')
  grad.addColorStop(0.5, 'rgb(150,150,150)')
  grad.addColorStop(0.75, 'rgb(55,58,59)')
  grad.addColorStop(0.85, 'rgb(25,20,31)')
  grad.addColorStop(0.91, 'rgb(240,240,240)')
  grad.addColorStop(0.95, 'rgb(166,175,194)')
  grad.addColorStop(1, 'rgb(50,50,50)')
  ctx.strokeStyle = grad
  ctx.lineWidth = 14
  ctx.strokeText(lowerText, posx + 4, posy + 3)

  ctx.strokeStyle = '#10193A'
  ctx.lineWidth = 12
  ctx.strokeText(lowerText, posx, posy)

  ctx.strokeStyle = '#DDD'
  ctx.lineWidth = 7
  ctx.strokeText(lowerText, posx, posy)

  grad = ctx.createLinearGradient(0 + offsetX, 20 + offsetY, 0 + offsetX, 100 + offsetY)
  grad.addColorStop(0, 'rgb(16,25,58)')
  grad.addColorStop(0.03, 'rgb(255,255,255)')
  grad.addColorStop(0.08, 'rgb(16,25,58)')
  grad.addColorStop(0.2, 'rgb(16,25,58)')
  grad.addColorStop(1, 'rgb(16,25,58)')
  ctx.strokeStyle = grad
  ctx.lineWidth = 6
  ctx.strokeText(lowerText, posx, posy)

  grad = ctx.createLinearGradient(0 + offsetX, 20 + offsetY, 0 + offsetX, 100 + offsetY)
  grad.addColorStop(0, 'rgb(245,246,248)')
  grad.addColorStop(0.15, 'rgb(255,255,255)')
  grad.addColorStop(0.35, 'rgb(195,213,220)')
  grad.addColorStop(0.5, 'rgb(160,190,201)')
  grad.addColorStop(0.51, 'rgb(160,190,201)')
  grad.addColorStop(0.52, 'rgb(196,215,222)')
  grad.addColorStop(1.0, 'rgb(255,255,255)')
  ctx.fillStyle = grad
  ctx.fillText(lowerText, posx, posy - 3)

  // output canvas
  return canvas
}