var GameTable = require('../GameTable.js');
var _ = require('underscore');

var gameTable = new GameTable();

var noDuplicationTest = function(){
  for(var i=0; i<1000; i++){
    gameTable.addGame({});
  }
  var codes = gameTable.getGames().map((game) => game.getCode());
  return _.uniq(codes).length == codes.length;
}

var allTestsPassed = function(){
  return noDuplicationTest();
}

console.log(allTestsPassed()?'All tests passed.':'Some tests doesn\'t passed.');
