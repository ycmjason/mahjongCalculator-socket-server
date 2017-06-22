var _ = require('underscore');
var Game = require('./Game.js');

var GameTable = module.exports = function(){
  var games = [];
  var removeEmptyGames = function(){
    var expiredGames = games.filter(game=>game.isExpired());
    if(expiredGames.length > 0){
      console.log('GameTable REMOVING ['+expiredGames.map(game=>game.getCode())+'].');
      games = games.filter(game=>!game.isExpired());
    }
  }

  var emptyGameClearanceService = setInterval(removeEmptyGames, 24*60*60*1000);

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
    var gamesThatClientIn = games.filter(game => game.containsSocket(socket));

    // removing socket will update the expiry day IF the game is empty,
    // then empty games will be cleared by emptyGameClearanceService
    // which is initialised at the start of this class
    gamesThatClientIn.forEach(game => game.removeSocket(socket));
  }

  /* for testing purpose, should not be called */
  this.getGames = () => games;

  this.getStat = function(){
    var stat = {};
    stat.games = games.map(game=>({
      code: game.getCode(),
      sockets: game.getSockets().map(socket=>socket.id)
    }));
    return stat;
  }
};
