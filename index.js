var fs = require('fs')
var Canvas = require('canvas');
var parseFont = require('./parse-font');

function writeLine(font, ctx, line, x, y) {
  x += font.spacing;
  y += font.spacing;

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
    x += sprite.size[0] + font.spacing;
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
    if (result[result.length-1] === '') {
      result.pop();
    }
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
    accum += sprite.size[0] + font.spacing;
  }
  return accum - font.spacing;
}

function getDimensions(font, text) {
  var margin = font.spacing * 2;
  var dim = {
    x: margin,
    y: (text.length) * (font.lineHeight+font.spacing),
  };

  for (var i = 0; i < text.length; i++) {
    var width = getTextWidth(font, text[i]) + margin;
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
    y += font.lineHeight + font.spacing;
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

