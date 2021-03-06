var GameTable = require('./GameTable.js');

var gameTable = new GameTable();
var addressClient = function(socket){
  return 'A client, '+socket.id+',';
}

exports.onConnection = function(socket){
  console.log(addressClient(socket)+' connected!');

  socket.on('new game', function(mjData){

    var game = gameTable.addGame(mjData);
    console.log(addressClient(socket)+' created '+game.getCode()+'.');
    game.addSocket(socket);
    socket.emit('update game code', game.getCode());
    socket.emit('update game userNumber', game.getNumberOfSockets());
  });

  socket.on('update game', function(g){
    console.log(addressClient(socket)+' updated '+g.code+'.');

    var game = gameTable.findGameByCode(g.code);
    game.setMjData(g.mjData);
    game.emit('update mjData', g.mjData);
  });

  socket.on('join game', function(code){
    var game = gameTable.findGameByCode(code);
    if(game==undefined){
      var msg = 'The code you provided is not found.';
      return socket.emit('[fail] join game', msg);
    }

    console.log(addressClient(socket)+' joined '+code+'.');

    game.addSocket(socket);
    socket.emit('update mjData', game.getMjData());
    game.emit('update game userNumber', game.getNumberOfSockets());
  });

  socket.on('disconnect', function(){
    console.log(addressClient(socket)+' disconnected.');

    var game = gameTable.findGameBySocket(socket);
    gameTable.socketDisconnect(socket);
    if(game != undefined){
      game.emit('update game userNumber', game.getNumberOfSockets());
    }
  });
};

exports.showStats = function(req, res){
  var stat = gameTable.getStat();
  res.send('<html><head></head><body><pre>'+JSON.stringify(stat, null, 4)+'</pre></body></html>');
}
