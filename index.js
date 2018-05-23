var fs = require('fs')
var Canvas = require('canvas');
var parseFont = require('./parse-font');

var inputText = process.argv[3];

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

parseFont(process.argv[2], (font) => {
  var textWidth = getTextWidth(inputText, font);
  var size = [textWidth + 4, font.spacing + 4];
  var canvas = new Canvas(size[0], size[1]);
  var ctx = canvas.getContext('2d');

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, size[0], size[1]);

  writeLine(font, ctx, inputText, 0, 0);

  var out = fs.createWriteStream(__dirname + '/out/' +
    inputText.replace(/[^0-9a-zA-Z ]/g, '') + '.png')
    , stream = canvas.pngStream();

  stream.on('data', function(chunk){
    out.write(chunk);
  });

  stream.on('end', function(){
    console.log('saved png');
  });
});

function getTextWidth(text, font) {
  var accum = 0;
  for(var i=0; i < text.length; i++) {
    accum += font.spriteMap[text[i]].size[0] + 1;
  }
  return accum - 1;
}
