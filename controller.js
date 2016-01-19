var GameTable = require('./GameTable.js');

var gameTable = new GameTable();

exports.onConnection = function(socket){
  console.log('A client, '+socket.id+', has connected!');

  socket.on('new game', function(mjData){
    console.log('A client, '+socket.id+' created a new game.');

    var game = gameTable.addGame(mjData);
    game.addSocket(socket);
    socket.emit('update game code', game.getCode());
    socket.emit('update game userNumber', game.getNumberOfSockets());
  });

  socket.on('update game', function(g){
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
    console.log('A client, '+socket.id+' joined '+code+'.');
    game.addSocket(socket);
    socket.emit('update mjData', game.getMjData());
    game.emit('update game userNumber', game.getNumberOfSockets());
  });

  socket.on('reconnect', function(){
    console.log('A client, '+socket.id+' reconnected.');
  });
  socket.on('disconnect', function(){
    var game = gameTable.findGameBySocket(socket);
    gameTable.socketDisconnect(socket);
    console.log('A client, '+socket.id+' disconnected.');
    if(game != undefined){
      game.emit('update game userNumber', game.getNumberOfSockets());
    }
  });
};
