var fs = require('fs')
var Canvas = require('canvas');
var parseFont = require('./parse-font');

function writeLine(font, ctx, line, x, y) {
  x += 2;
  y += 2;

  for(var i=0; i < inputText.length; i++) {
    var sprite = font.spriteMap[inputText[i]];
    console.log(sprite);
    ctx.drawImage(font.image,
      sprite.location[0], sprite.location[1],
      sprite.size[0], sprite.size[1],
      x, y,
      sprite.size[0], sprite.size[1]);
    x += sprite.size[0] + 1;
  }
}

function readFile(filename, callback) {
  var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(filename),
  });

  var result = [];

  lineReader.on('line', (line) => {
    result.push(line);
    console.log('Line from file:', line);
  });

  lineReader.on('close', () => {
    callback(result);
  });
}

function writeText(font, ctx, text) {

}

function createImage(x, y, callback) {
  var canvas = new Canvas(x, y);
  var ctx = canvas.getContext('2d');
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, x, y);

  callback(canvas, ctx);
}

function saveImage(canvas, name) {
  var out = fs.createWriteStream(__dirname + '/out/' +
    inputText.replace(/[^0-9a-zA-Z ]/g, '') + '.png')
    , stream = canvas.pngStream();

  stream.on('data', (chunk) => {
    out.write(chunk);
  });

  stream.on('end', () => {
    console.log('saved png');
  });
}

var inputText = process.argv[3];

parseFont(process.argv[2], (font) => {
  var textWidth = getTextWidth(inputText, font);
  createImage(textWidth + 4, font.spacing + 4, (canvas, ctx) => {
    writeLine(font, ctx, inputText, 0, 0);
    var outFilename = fs.createWriteStream(__dirname + '/out/' +
      inputText.replace(/[^0-9a-zA-Z ]/g, '') + '.png')
    saveImage(canvas, outFilename);
  });
});

function getTextWidth(text, font) {
  var accum = 0;
  for(var i=0; i < text.length; i++) {
    accum += font.spriteMap[text[i]].size[0] + 1;
  }
  return accum - 1;
}
