
var Canvas = require('canvas')
  , Image = Canvas.Image;

var inputText = "input";
var fontSize = 5;
var textWidth = getTextWidth(inputText, fontSize);

var sizeX = textWidth + 4;
var sizeY = fontSize + 4;

var canvas = new Canvas(textWidth + 4, fontSize +4)
  , ctx = canvas.getContext('2d');

ctx.fillStyle = "black";
ctx.fillRect(0, 0, sizeX, sizeY);
ctx.fillStyle = "white";
ctx.font = fontSize + 'px Impact';
ctx.fillText("Awesome!", 2, 2+fontSize);

var fs = require('fs')
  , out = fs.createWriteStream(__dirname + '/text.png')
  , stream = canvas.pngStream();

stream.on('data', function(chunk){
  out.write(chunk);
});

stream.on('end', function(){
  console.log('saved png');
});

/**
 * Uses canvas.measureText to compute and return the width of the given text of given font in pixels.
 *
 * @param {String} text The text to be rendered.
 * @param {String} font The css font descriptor that text is to be rendered with (e.g. "bold 14px verdana").
 *
 * @see http://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
 */
function getTextWidth(text, font) {
    // if given, use cached canvas for better performance
    // else, create new canvas
    var canvas = new Canvas(textWidth + 4, fontSize +4)
      , context = canvas.getContext('2d');
    context.font = font;
    var metrics = context.measureText(text);
    return metrics.width;
}
