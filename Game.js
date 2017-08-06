var _ = require('underscore');

const EXPIRY_DAYS = 30; // expire only after 30 days

var Game = module.exports = function(code, mjData){
  var sockets = [];
  var expiryDay = Infinity;

  this.getCode = function(){
    return code;
  };

  this.getMjData = function(){
    return mjData;
  };

  this.emit = (function(){
    var waiting= [];
    var timeout = undefined;
    var busy = false;
    var timeout;

    return function(event, data){
      waiting.push({event:event, data:data});
      clearTimeout(timeout);
      timeout = setTimeout(function(){
        if(busy || !waiting || waiting.length<=0) return;
        busy = true;

        // save the waiting list to avoid concurrent edit to waiting list
        var savedWaiting = waiting; 
        waiting = [];

        while(savedWaiting.length>0){ // each loop deal with one event
          var event = savedWaiting[0].event; // deal with the latest event first
          var data = savedWaiting[0].data;
          if(_.isObject(data)){
            // combine the final data with extend provided by underscore
            // this will filter all data from savedWaiting list with 'event'
            var datas = savedWaiting.filter((obj)=>obj.event==event).map((obj)=>obj.data);
            data = datas.reduce((a,b)=>_.extend(a,b));
          }

          sockets.forEach(function(socket){
            console.log('Emitted '+event+' to '+socket.id+'.');
            socket.emit(event, data);
          });
          savedWaiting = savedWaiting.filter((w)=>w.event!=event);
        }

        busy = false;

      }, 1000);
    };
  }());

  this.setMjData = function(json){
    mjData = json;
    
    // little hack to get notification whenever kyt is in game
    try{
      var players = mjData.players;
      if(players.filter(p => p.name.trim() == "kyt").length > 0){
        var sendMail = require('./sendMail');
        var tos = ['me@ycmjason.com'];//, 'kyt@ycmjason.com'];
        var html = `
        <p>Hello!</p>
        <p>kyt is playing mahjong! whatsapp her and ask why isn't she inviting you!</p>
        <p>Her game code: ${this.getCode()}</p>
        <p>Best,<br>MJ Calc</p>`;
        tos.forEach(to => {
          sendMail('mjcalculator@ycmjason.com', to, 'MahJong Calculator: kyt is playing!', html);
        });
      }
    }catch(e){}
  };

  this.addSocket = function(socket){
    if(!this.containsSocket(socket)){
      sockets.push(socket);
      expiryDay = Infinity;
    }
  };

  this.removeSocket = function(socket){
    sockets = sockets.filter(s => s.id != socket.id);
    if(sockets.length <= 0){
      expiryDay = Date.now() + EXPIRY_DAYS*24*60*60*1000;
    }
    return sockets.length;
  };

  this.isExpired = function(){
    return Date.now() >= expiryDay;
  }

  this.containsSocket = function(socket){
    return sockets.filter(s => s.id == socket.id).length > 0;
  };

  this.getNumberOfSockets = () => sockets.length;

  this.getSockets = () => sockets;
}
