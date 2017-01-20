"use strict";
/*
 // sending to sender-client only
    socket.emit('message', "this is a test");

  // sending to all clients, include sender
    io.emit('message', "this is a test");

  // sending to all clients except sender
    socket.broadcast.emit('message', "this is a test");

  // sending to all clients in 'game' room(channel) except sender
    socket.broadcast.to('game').emit('message', 'nice game');

  // sending to all clients in 'game' room(channel), include sender
    io.in('game').emit('message', 'cool game');

  // sending to sender client, only if they are in 'game' room(channel)
    socket.to('game').emit('message', 'enjoy the game');

  // sending to all clients in namespace 'myNamespace', include sender
    io.of('myNamespace').emit('message', 'gg');

  // sending to individual socketid
    socket.broadcast.to(socketid).emit('message', 'for your eyes only');
    */

const path = require('path');
const firebase = require(path.join(__dirname, '..', 'framework', 'firebase'));

module.exports = function (server) {
  var io = require('socket.io')(server);
  io.set('origins', '*:*');
  io.sockets.on('connection', function (socket) {
    setSockets(io, socket);
  });
};

function setSockets(io, socket){

  // Generate Unique ID for chrome extension. If already exists, then join the room
  socket.on('join', (data)=>{
    if(!data || !data.id){
      socket.emit('join-with', generateRandomId());
      return;
    }else{
      // data.id stores the id of chrome-extension which was assigned on first connect
      socket.join(data.id);
    }
  });

  // Generate Unique ID for mobile application. If already exists, then join the room
  socket.on('phone-join', (data)=>{
    if(!data || !data.id){
      socket.emit('join-with', generateRandomId(40));
      return;
    }else{
      // data.id stores the id of phone which was assigned on first connect
      socket.join(data.id);
    }
  });

  socket.on('pairing', (data)=>{
    // data.chromeId is the id of chrome extension
    // data.phoneId is the id of mobile phone
    // data.fcmId is the FCM registration id of mobile phone

    // Send to chrome extension with which pairing is being done. Make chrome store phoneId and fcm
    io.in(data.chromeId).emit('pairing', {
      chromeId: data.chromeId,
      phoneId: data.phoneId,
      fcm: data.fcmId
    });

  });

  // Whenever authentication is requested by chrome extension, send notification to mobile for user id and password
  socket.on('initiate-authentication', (data)=>{
    firebase.sendMessage(data.fcm, {
      url: data.url,
      type: data.type || 'login',
      chromeId: data.chromeId
    });
  });

  socket.on('mobile-authenticated', (data)=>{
    io.in(data.chromeId).emit('mobile-authentication', {
      success: data.success,
      __userid: data.userId,
      __password: data.password1,
      __passwordAlternate: data.alternate,
      __key: data.key
    })
  });

  socket.on('chrome-authentication', (data)=>{
    io.in(data.phoneId).emit('chrome-authentication', {
      success: data.success,
      url: data.url,
      otpRequired: data.otpRequired || false
    });
  });

  socket.on('phone-otp', (data)=>{
    io.in(data.chromeId).emit('otp', {
      otp: data.otp
    });
  });

//assign unique ids to all device for communication. use redis for searching and storing

}

const allowed = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890~!@#$%^&*()_+=|][}{:;<>,/?";

function generateRandomId(length){
  length = length || 32;
  let date = (new Date()).getTime();    //epoch time of length 13
  date = date.toString();
  let str = date;
  for(let i=0;i<(length-date.length);i++){
    let a = Math.random() * allowed.length;
    a = Math.floor(a);
    str += allowed[a];
  }
  return str;
}
