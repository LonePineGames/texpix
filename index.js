var fs = require('fs')
var Canvas = require('canvas');
var parseFont = require('./parse-font');

function writeLine(font, ctx, line, x, y) {
  x += 2;
  y += 2;

  for(var i=0; i < line.length; i++) {
    var sprite = font.spriteMap[line[i]];
    if (!sprite) {
      sprite = font.spriteMap[' '];
      console.log("character not found: " + line[i]);
    }
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
    console.log(line);
  });

  lineReader.on('close', () => {
    console.log();
    callback(result);
  });
}

function getTextWidth(font, text) {
  var accum = 0;
  for(var i=0; i < text.length; i++) {
    var sprite = font.spriteMap[text[i]];
    if (!sprite) {
      sprite = font.spriteMap[' '];
    }
    accum += sprite.size[0] + 1;
  }
  return accum - 1;
}

function getDimensions(font, text) {
  var dim = {x: 4, y: text.length * font.spacing + 4};

  for (var i = 0; i < text.length; i++) {
    var width = getTextWidth(font, text[i]) + 4;
    if (width > dim.x) {
      dim.x = width;
    }
  }

  console.log("Dimensions: ", dim);
  return dim;
}

function writeText(font, ctx, text) {
  var y = 0;
  for (var i = 0; i < text.length; i++) {
    writeLine(font, ctx, text[i], 0, y);
    y += font.spacing;
  }
}

function createImage(dim, callback) {
  var canvas = new Canvas(dim.x, dim.y);
  var ctx = canvas.getContext('2d');
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, dim.x, dim.y);

  callback(canvas, ctx);
}

function saveImage(canvas, filename) {
  var out = fs.createWriteStream(filename);
  var stream = canvas.pngStream();

  stream.on('data', (chunk) => {
    out.write(chunk);
  });

  stream.on('end', () => {
    console.log('saved ' + filename);
  });
}

function processFile(inFilename) {
  parseFont(process.argv[2], (font) => {
    readFile(inFilename, (text) => {
      var dim = getDimensions(font, text);
      createImage(dim, (canvas, ctx) => {
        writeText(font, ctx, text);
        var outFilename = inFilename + '.png';
        saveImage(canvas, outFilename);
      });
    });
  });
}

processFile(process.argv[3]);

