const http = require('http');
const express = require('express');
const path = require('path');
const socketio = require('socket.io');

const formatMessage = require('./utils/message.js')
const {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
  } = require('./utils/users');


const publicPath = path.join(__dirname,'public');
const PORT = process.env.PORT || 8080;

let app = express();
let server  = http.createServer(app);
let io = socketio(server);
const botName = 'Gapshap App';

app.use(express.static(publicPath));

io.on('connection',(socket)=>{
 // Run when clients connect
    socket.on('joinRoom',({username,room})=>{
        
        const user = userJoin(socket.id,username,room);

        socket.join(room);

        socket.emit('welcome-message',formatMessage(botName,"Let's start Gapshap"))

        // Broadcast when user is connects
        socket.broadcast
        .to(user.room)
        .emit(
            'welcome-message',formatMessage(botName,`${user.username} has joined  the chat`)
            );

            //Send users anad rooms info
            io.to(user.room).emit('roomUsers',{
                room:user.room,
                users:getRoomUsers(user.room)
            })

    });
    
    //Listen from chatroom
 // Listen for chatMessage
 socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);
    console.log(socket.id)
    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });
  socket.on('disconnect',()=>{
        const user = userLeave(socket.id);

        if(user){

        io.to(user.room).emit('welcome-message',formatMessage(botName,`${user.username} has left the chat`))
            
        //Send users anad rooms info
        io.to(user.room).emit('roomUsers',{
            room:user.room,
            users:getRoomUsers(user.room)
        })
    }
    })
})



server.listen(PORT,()=>{
    console.log(`Server is Running  ${PORT}`);
})