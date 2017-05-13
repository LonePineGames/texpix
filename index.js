var Canvas = require('canvas')
  , Image = Canvas.Image
  , canvas = new Canvas(200, 200)
  , ctx = canvas.getContext('2d');

ctx.font = '30px Impact';
ctx.fillText("Awesome!", 50, 100);

var fs = require('fs')
  , out = fs.createWriteStream(__dirname + '/text.png')
  , stream = canvas.pngStream();

stream.on('data', function(chunk){
  out.write(chunk);
});

stream.on('end', function(){
  console.log('saved png');
});
