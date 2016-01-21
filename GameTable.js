var _ = require('underscore');

var Game = function(code, mjData){
  var sockets = [];
  this.getCode = function(){
    return code;
  };
  this.getMjData = function(){
    return mjData;
  };
  this.emit = function(event, data){
    sockets.forEach(function(socket){
      socket.emit(event, data);
    });
  };
  this.setMjData = function(json){
    mjData = json;
  };
  this.addSocket = function(socket){
    if(!this.containsSocket(socket))
      sockets.push(socket);
  };
  this.removeSocket = function(socket){
    sockets = sockets.filter(s => s.id != socket.id);
    return sockets.length;
  };
  this.containsSocket = function(socket){
    return sockets.filter(s => s.id == socket.id).length > 0;
  };
  this.getNumberOfSockets = ()=>sockets.length;
}

var GameTable = module.exports = function(){
  var games = [];
  var generateCode = function(){
    // code is constructed by 4 char (lower case)
    // Therefore the max. number of games is 26^4 = 456976
    var randomCode = function(){
      var randomChar = function(){
        return String.fromCharCode(Math.floor((Math.random() * 26)) + 97);
      };
      return randomChar()+randomChar()+randomChar()+randomChar();
    };
    var code;
    var existingCodes = games.map(function(game){
      return game.getCode();
    });
    
    /* find an unused code and return it */
    do{
      code = randomCode();
    }while(_.contains(existingCodes, code));

    return code;
  };
  this.addGame = function(mjData){
    var game = new Game(generateCode(), mjData)
    games.push(game);
    return game;
  };
  this.findGameByCode = function(code){
    return games.filter(game => game.getCode()==code)[0];
  }
  this.findGameBySocket = function(socket){
    return games.filter(game => game.containsSocket(socket))[0];
  }
  this.socketDisconnect = function(socket){
    games.forEach(function(game){
      setTimeout(function(){
        game.removeSocket(socket);
      }, 10*1000/*24*60*60*1000*/);
    });
    games=games.filter(game=>game.getNumberOfSockets()>0);
  }
  /* for testing purpose, should not be called */
  this.getGames = () => games;
};
