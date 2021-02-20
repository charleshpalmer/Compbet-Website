const users = []; //Creating an array to hold current users in the Livechat rooms.

//Joins the current user to the chatroom.
function connectUser(id, username, room) {

    const user = { id, username, room };
  
    users.push(user);
  
    return user;

  }

//Gets the id of the current user. 
function idOfUser(id) {

    return users.find(user => user.id === id);

  }

//Runs when the user leaves the chatroom.
function disconnectUser(id) {

  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {

    return users.splice(index, 1)[0];

  }

}

//Gets the names of all users in the current room.
function usersInRoom(room) {

  return users.filter(user => user.room === room);

}

module.exports = {connectUser, idOfUser, disconnectUser,  usersInRoom}; //Export the functions to they can be used in the app.js file.