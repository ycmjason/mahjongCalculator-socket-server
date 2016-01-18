var GameTable = require('./GameTable.js');

var gameTable = new GameTable();

exports.onConnection = function(socket){
  console.log('A client, '+socket.id+', has connected!');

  socket.on('new game', function(mjData){
    console.log(socket.id+' created a new game.');

    var game = gameTable.addGame(mjData);
    game.addSocket(socket);
    socket.emit('update game code', game.getCode());
  });

  socket.on('update game', function(g){
    var game = gameTable.findGameByCode(g.code);
    game.setMjDataAndUpdateSockets(g.mjData);
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
  });
  socket.on('disconnect', function(){
    console.log(socket.id+' disconnected.');
    gameTable.socketDisconnect(socket);
    console.log(gameTable.getGames().map(game=>game.getNumberOfSockets()));
  });
};
