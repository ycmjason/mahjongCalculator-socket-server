var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(function(req, res, next){
  res.setHeader('Access-Control-Allow-Origin', 'http://www.ycmjason.com');
  res.setHeader('Access-Control-Allow-Origin', 'http://www.doc.ic.ac.uk');
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
