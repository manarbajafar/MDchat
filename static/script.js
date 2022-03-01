var socket = io();
//var uploader = new SocketIOFileUpload(socket);
//uploader.listenOnInput(document.getElementById("imagefile"));

const loginForm = document.getElementById("loginForm");
const name = document.getElementById("name");
loginForm.addEventListener("submit", function(e) {
   e.preventDefault();
   setUsername();
});

function setUsername() {
   socket.emit('setUsername', name.value);
};


var user;
socket.on('userExists', function(data) {
   document.getElementById('error-container').innerHTML = data;
});
socket.on('userSet', function(data) {
   user = data.username;
   document.body.innerHTML =  '<div id = "messageArea"></div><form id = "messageInput"><input type = "text" id = "message" value = "" placeholder = "Enter your message here.." ><div class="img-upload"><label for="imagefile"><img src="files.png"/></label><input type="file" id="imagefile" name="files"  style="display: none;" ></div><button id="send" type = "submit" name = "button" onclick ="sendMessage()" >Send</button></form>';
   enterMessage();
});

function enterMessage(){

   const messageInput = document.getElementById("messageInput");
   console.log(messageInput);
   messageInput.addEventListener("submit", function(e) {
      e.preventDefault();
      sendMessage();
   });

}
function sendMessage() {
      var input = document.getElementById('message');
      var msg = input.value;
      if(msg) {
         socket.emit('msg', {message: msg, user: user});
      }
      input.value = '';
   }

   $('#messageInput').submit(function(e){
      e.preventDefault();
      var input = document.getElementById('message');
      var msg = input.value;
      if(msg) {
         socket.emit('msg', {message: msg, user: user});
      }
      input.value = '';
      });

socket.on('newmsg', function(data) {
   if(user) {
      document.getElementById('messageArea').innerHTML += '<div><b>' + 
         '&nbsp&nbsp'+data.user + '</b>: ' + data.message + '</div>'
   }
})
var siofu = new SocketIOFileUpload(socket);
// Configure the three ways that SocketIOFileUpload can read files:

siofu.listenOnInput(document.getElementById("imagefile"));


// Do something on upload progress:
siofu.addEventListener("progress", function(event){
    var percent = event.bytesLoaded / event.file.size * 100;
    console.log("File is", percent.toFixed(2), "percent loaded");
});

// Do something when a file is uploaded:
siofu.addEventListener("complete", function(event){
    console.log(event.success);
    console.log(event.file);
});
//----------------------------------------
/* $('#imagefile').bind('change', function(e){
    var data = e.originalEvent.target.files[0];
	console.log('read');
    readThenSendFile(data);    
console.log('sent');
	
	
});

function readThenSendFile(data){

    var reader = new FileReader();
    reader.onload = function(evt){
        var msg ={};
        msg.username = username;
        msg.file = evt.target.result;
        msg.fileName = data.name;
        socket.emit('base64 file', msg);
    };
    reader.readAsDataURL(data);
	console.log('sent');
} */
//--------------------------------------------