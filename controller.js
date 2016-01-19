var GameTable = require('./GameTable.js');

var gameTable = new GameTable();

exports.onConnection = function(socket){
  console.log('A client, '+socket.id+', has connected!');

  socket.on('new game', function(mjData){
    console.log(socket.id+' created a new game.');

    var game = gameTable.addGame(mjData);
    game.addSocket(socket);
    socket.emit('update game code', game.getCode());
    socket.emit('update game userNumber', game.getNumberOfSockets());
  });

  socket.on('update game', function(g){
    var game = gameTable.findGameByCode(g.code);
    game.setMjData(g.mjData);
    game.emit(g.mjData);
  });

  socket.on('join game', function(code){
    console.log(socket.id+' joined '+code+'.');
    var game = gameTable.findGameByCode(code);
    if(game==undefined){
      var msg = 'The code you provided is not found.';
      return socket.emit('[fail] join game', msg);
    }
    game.addSocket(socket);
    socket.emit('update mjData', game.getMjData());
    game.emit('update game userNumber', game.getNumberOfSockets());
  });
  socket.on('disconnect', function(){
    var game = gameTable.findGameBySocket(socket);
    console.log(socket.id+' disconnected.');
    if(game){
      game.emit('update game userNumber', game.getNumberOfSockets());
    }
    gameTable.socketDisconnect(socket);
  });
};
