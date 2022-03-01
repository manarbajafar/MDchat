const express = require('express');
var savefile = require("socketio-file-upload");
const app = express().use(savefile.router);
var http = require('http').Server(app);
var io = require('socket.io')(http);
const path = require('path');

app.use(
  express.static( path.join(__dirname, '/static') )
);

app.use(express.static(__dirname + '/node_modules')); 
users = [];
io.on('connection', function(socket) {
   var uploader = new savefile();
   uploader.dir = __dirname + '/node_modules/upload';
   uploader.listen(socket);
   socket.on('setUsername', function(data) {
      if(users.filter((user)=> user.username==data).length>0) {
         socket.emit('userExists','&nbsp&nbsp'+ data + ' username is taken! Try some other username.');
      } else {
         users.push({username: data, socket});
         socket.emit('userSet', {username: data});
         console.log(data+" connected");
      }
      console.log('NOW %s users connected', users.length);
   });

        socket.on('disconnect', function(){
          var user=users.find((user)=> user.socket==socket)
              console.log(user.username+" disconnected");
              users=users.filter((targetUser)=> targetUser.username!= user.username)
              console.log('NOW %s users connected', users.length);
          }); 

   socket.on('msg', function(data) {
      //Send message to everyone
      io.sockets.emit('newmsg', data);
   })
   
   uploader.on("saved", function(event){
      console.log(event.file);
    });
 //--------------------------------------1
/* socket.on('base64 file', function (msg) {
    console.log('received base64 file from' + msg.username);
    socket.username = msg.username;
    // socket.broadcast.emit('base64 image', //exclude sender
    io.sockets.emit('base64 file', msg);
}); */
//---------------------------------------------2 
});

http.listen(8000, function() {
   console.log('listening on localhost:8000');
});