var canvasWidth = Math.min(800, $(window).width() - 20)
// var canvasWidth = 800
var canvasHeight = canvasWidth

var strokeColor = 'black'
var isMouseDown = false
var lastLoc = {x: 0, y: 0}
var lastTimestamp = 0
var lastLineWidth = -1


var canvas = document.getElementById('canvas')
var drawCanvas = document.getElementById('drawCanvas')
// console.log('canvas', canvas)
var context = canvas.getContext('2d')
canvas.width = canvasWidth
drawCanvas.width = canvasWidth
drawCanvas.height =canvasHeight
canvas.height = canvasHeight

$('#controller').css('width', canvasWidth + 'px')
drawGrid()
var longPolling
function polling() {
  longPolling = setInterval(function() {
    returnData() }, 200)
}
//canvas导出数据流
// returnData()
function returnData() {
  socket.emit('startConnect', canvas.toDataURL())
}
$("#clear_btn").click(
  function(e) {
    context.clearRect(0, 0, canvasWidth, canvasHeight)
    drawGrid()
    returnData()
  }
)
$(".color_btn").click(
  function(e){
    $('.color_btn').removeClass('color_btn_selected')
    $(this).addClass('color_btn_selected')
    strokeColor = $(this).css('background-color')
  }
)
function beginStroke(point) {
  isMouseDown = true
  lastLoc = windowToCanvas(point.x, point.y )
  lastTimestamp = new Date().getTime()
  polling()
}
function endStroke() {
  // returnData()
  isMouseDown = false
  clearInterval(longPolling)
}
function moveStroke(point){
    var curLoc = windowToCanvas(point.x, point.y )
    var curTimestamp = new Date().getTime()
    var s = calcDistance(curLoc, lastLoc)
    var t = curTimestamp - lastTimestamp

    var lineWidth = calcLineWidth( t, s )
    // console.log('lineWidth', lineWidth)
    //draw
    context.beginPath()
    context.moveTo(lastLoc.x, lastLoc.y)
    context.lineTo(curLoc.x, curLoc.y)

    context.strokeStyle = strokeColor
    context.lineWidth = lineWidth
    context.lineCap = 'round'
    context.lineJoin = 'round'
    context.stroke()

    lastLoc = curLoc
    lastTimestamp = curTimestamp
    lastLineWidth = lineWidth
}

canvas.onmousedown = function(e){
  e.preventDefault() //阻止默认的动作发生
  beginStroke({ x: e.clientX, y: e.clientY })
}
canvas.onmouseup = function(e){
  e.preventDefault()
  endStroke()
  // console.log('onmouseup')
}
canvas.onmouseout = function(e){
  e.preventDefault()
  endStroke()
  // console.log('onmouseout')
}
canvas.onmousemove = function(e){
  if (isMouseDown) {
    e.preventDefault()
    moveStroke({x: e.clientX, y: e.clientY})
    // console.log('onmousemove')
  }
}

canvas.addEventListener('touchstart', function(e){
  e.preventDefault()
  touch = e.touches[0]
  beginStroke({ x: touch.pageX, y: touch.pageY })
})
canvas.addEventListener('touchmove', function(e){
  e.preventDefault()
  if (isMouseDown) {
      touch = e.touches[0]
    moveStroke({ x: touch.pageX, y: touch.pageY })
    // console.log('onmousemove')
  }
})
canvas.addEventListener('touchend', function(e){
  e.preventDefault()
  endStroke()
})



function calcLineWidth(t, s) {
  var v = s / t
  var resultLineWidth = 0
  if ( v <= 0.1 ) {
    resultLineWidth = 10
  } else if ( v >= 10 ) {
    resultLineWidth = 1
  } else {
    resultLineWidth = 10 - (v - 0.1) / (10 - 0.1) * (10 - 1)
  }
  if (lastLineWidth ==    -1) {
    return resultLineWidth
  } else {
    return lastLineWidth * 2/3 + resultLineWidth * 1/3
  }

}

function calcDistance(loc1, loc2) {
  return Math.sqrt((loc1.x - loc2.x)*(loc1.x - loc2.x) + (loc1.y - loc2.y)*(loc1.y - loc2.y))
}

function windowToCanvas(x, y) {
  var box = canvas.getBoundingClientRect()
  return {x: Math.round(x-box.left), y: Math.round(y-box.top)}
}

function drawGrid() {
  context.save()
  context.strokeStyle = "rgb(230, 11, 9)"

  context.beginPath()
  context.moveTo(3, 3)
  context.lineTo(canvasWidth - 3, 3)
  context.lineTo(canvasWidth - 3, canvasHeight - 3)
  context.lineTo(3, canvasHeight - 3)
  context.closePath()

  context.lineWidth = 6
  context.stroke()

  context.beginPath()
  context.moveTo(0, 0)
  context.lineTo(canvasWidth, canvasHeight)
  context.moveTo(canvasWidth, 0)
  context.lineTo(0, canvasHeight)
  context.moveTo(canvasWidth / 2, 0)
  context.lineTo(canvasWidth / 2, canvasHeight)
  context.moveTo(0, canvasHeight / 2)
  context.lineTo(canvasWidth, canvasHeight / 2 )
  context.closePath()

  context.lineWidth = 1
  context.stroke()
  context.restore()
}
