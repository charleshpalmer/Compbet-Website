//Importing neccesary packages.
const socket = io();

const chatForm = document.getElementById('chat-form');

const chatMessages = document.querySelector('.chat-messages');

const roomName = document.getElementById('room-name');

const userList = document.getElementById('users');

// Get clients username and  selected room from  the URL.
const { username, room } = Qs.parse(location.search, {

  ignoreQueryPrefix: true

});

// Join the user to the chatroom.
socket.emit('joinRoom', { username, room });

// Get the room name and the users who are in the room.
socket.on('roomUsers', ({ room, users }) => {

  outputRoomName(room);

  outputUsers(users);

});

// Message from server to the client.
socket.on('message', message => {

  console.log(message);
  outputMessage(message);

  //Scroll down the chat box after a message has been typed.
  chatMessages.scrollTop = chatMessages.scrollHeight;

});

// Message submit
chatForm.addEventListener('submit', e => {

  e.preventDefault();

  // Get message text
  const msg = e.target.elements.msg.value;

  //Emit the typed message to the server
  socket.emit('chatMessage', msg);

  // Clear the user input after a message has been typed.
  e.target.elements.msg.value = '';

  e.target.elements.msg.focus();

});

// Output message to DOM element on the page. (This will be displayed to the user in the Livechat page.)
function outputMessage(message) {

  const div = document.createElement('div');

  div.classList.add('message');

  div.innerHTML = `<p class="meta">${message.username}<span>${message.time}</span></p>

  <p class="text">${message.text}</p>`;

  document.querySelector('.chat-messages').appendChild(div);
  
}

// Add room name to DOM element. (This will be displayed to the user in the Livechat page.)
function outputRoomName(room) {

  roomName.innerText = room;

}

// Add users to DOM element. (This will be displayed to the user in the Livechat page.)
function outputUsers(users) {

  userList.innerHTML = ''; //Create an empty user list.

  users.forEach(user=>{ //For each user who joins the room.

    const li = document.createElement('li'); //Create a new list item element.

    li.innerText = user.username; //Add the username to the list item element created above.

    userList.appendChild(li); //Update the user list.
    
  });

}