let chatForm = document.getElementById('chat-form');
const chatList =   document.querySelector('#chat-message-list');
let roomName = document.getElementById('room-name');
let userList = document.getElementById('conversation-list');


// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
  });


let socket = io();

//join chat room 
socket.emit('joinRoom',{username,room});

// Get room and users 

socket.on('roomUsers',({room, users})=>{
    outputRoomName(room);
    outputRoomUsers(users);
})

    socket.on('welcome-message',(msg)=>{
        console.log(msg)
        welcomeMessage(msg)
     chatList.scrollTop = chatList.scrollHeight;
    })
    socket.on('message',(msg)=>{
        console.log(msg);
        outputMessage(msg)
     chatList.scrollTop = chatList.scrollHeight;

    })

 chatForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const msg = e.target.elements.msg.value;
    socket.emit('chatMessage',msg)
  
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
   
})

function outputMessage(msg){
    
     let currentUser = msg.username ;
    let currentClass = 'other';
    if(username === msg.username) {currentUser = 'You';currentClass ='you';}
    const div = document.createElement('div');
    div.classList.add('message-content');
    div.innerHTML = `<div class="message-row ${currentClass}-message">
                        <div class="message-text">${msg.text}</div>
                        <div class="message-line"> <b class="message-time">${currentUser} </b> ${msg.time}</div>
                    </div>`;
    
  const chatList =   document.querySelector('#chat-message-list');
  chatList.appendChild(div);
    
}

function welcomeMessage(msg){
    
    const div = document.createElement('div');
    div.classList.add('message-content');
    div.innerHTML = `<div class="message-content">
                    <div class="message-row welcome-message">
                        <div class="message-text"> ${msg.username} <br> ${msg.text}</div>
                        <div class="message-line"> ${msg.time}</div>
                    </div>
                </div>`;
    
 
  chatList.appendChild(div);
    
}

// Add room into Dom 

function outputRoomName(room){
 roomName.innerText = room;
}

// Add usrs into Dom 

function outputRoomUsers(users){
 userList.innerHTML = `
 ${users.map(user => ` <div class="conversation ">
                            <i class="fas fa-user  fa-lg " id="user" ></i>

                            <div class="title-text">
                               ${user.username}
                            </div>
                           
                            </div>
                        </div>`
).join(``)}
 `;
}