var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(function(req, res, next){
  res.setHeader('Access-Control-Allow-Origin', 'http://www.ycmjason.com');
  res.setHeader('Access-Control-Allow-Origin', 'http://www.doc.ic.ac.uk');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  next();
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
