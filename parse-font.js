module.exports = function parseFont(name, cb) {
  var filename = __dirname + '/fonts/' + name;
  var config = JSON.parse(require("fs").readFileSync(filename + '.json'));
  console.log("config", config);
  var index = config.index;
  loadImage(filename + '.png', (canvas, image) => {
    var ctx = canvas.getContext('2d');
    ctx.antialias = 'none';

    var font = {
      ...config,
      canvas,
      ctx,
      image,
      lineHeight: 0,
      spriteMap: {},
    };

    var fromRow = 0;
    var toRow = 1;
    for (var i = 0; i < index.length; i ++) {
      var pixel = 0;
      for(;pixel === 0 && toRow < canvas.height; toRow ++) {
        pixel = ctx.getImageData(0, toRow, 1, 1).data[0];
      }
      createRow(font, fromRow, toRow, index[i]);
      fromRow = toRow - 1;
    }

    cb(font);
  });
}

var Canvas = require('canvas'),
  Image = Canvas.Image,
  fs = require('fs');

function loadImage(name, cb) {
  fs.readFile(name, function(err, image) {
    if (err) throw err;
    img = new Image;
    img.src = image;
    canvas = new Canvas(img.width, img.height);
    ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, img.width, img.height);
    cb(canvas,img);
  });
}

  /*private void printSection (final BufferedImage image, final int x, final int y, final int xs, final int ys) {
    for(int i = y; i < ys && i < image.getHeight(); i ++) {
      for(int j = x; j < xs && j < image.getWidth(); j ++) {
        int pixel = image.getRGB(j, i);
        System.out.print(pixel >= 0 ? ' ' : 'O');
      }
      System.out.println();
    }
  }*/

function createRow (font, fromRow, toRow, index) {
  var lineHeight = toRow - fromRow - 1;
  if(font.lineHeight < lineHeight) {
    font.lineHeight = lineHeight;
  }
  var fromCol = 1;
  var toCol = 1;
  var ctx = font.ctx;
  for(var i = 0; i < index.length; i ++) {
    var pixel = 0;
    for(;pixel === 0 && toCol < font.canvas.width; toCol ++) {
      pixel = ctx.getImageData(toCol, fromRow, 1, 1).data[0];
    }
    createCharacter(font, fromRow + 1, toRow - 1, fromCol, toCol - 1, index.charAt(i));
    fromCol = toCol;
    toCol ++;
  }
}

function createCharacter (font, fromRow, toRow, fromCol, toCol, c) {
  const width = font.canvas.width;
  const height = font.canvas.height;
  const location = [fromCol, fromRow];
  const size = [toCol - fromCol, toRow - fromRow];

  font.spriteMap[c] = {
    character: c,
    location,
    size,
  };

}

