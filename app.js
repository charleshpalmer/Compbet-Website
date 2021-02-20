//Importing neccesary packages.

const express = require('express');

const expressLayouts = require('express-ejs-layouts');

const mongoose = require('mongoose');

const flash = require('connect-flash');

const session = require('express-session');

const passport = require('passport');

const app = express();

app.use('/public', express.static('public')); //Set the route for css and img files.

const path = require('path');

const http = require('http');

const socketio = require('socket.io');

const styleChat = require('./chatfunctions/chatmsg');

const {connectUser, idOfUser, disconnectUser, usersInRoom} = require('./chatfunctions/chatusers'); //Pass in functions from users.js file for use in Livechat functionality.

const server = http.createServer(app);

const io = socketio(server);

const livechatBot = 'Admin '; //Setting the Bot name for use in the Livechat

// Run when client connects
io.on('connection', socket => {

  socket.on('joinRoom', ({ username, room }) => {

    const user = connectUser(socket.id, username, room);

    socket.join(user.room);

    //Welcome the current user when they join the livechat.
    socket.emit('message', styleChat(livechatBot,'Welcome to the livechat!'));

    //Broadcast when a user connects to the chat.
    socket.broadcast.to(user.room).emit('message', styleChat(livechatBot, `${user.username} has joined the chat`));

    //Send user name and room name information. 
    io.to(user.room).emit('roomUsers', {

      room: user.room,

      users: usersInRoom(user.room)

    });

  });
    
  //Listen for chatMessage being send via client to the Livechat.
  socket.on('chatMessage', msg => {

    const user = idOfUser(socket.id); 

    io.to(user.room).emit('message', styleChat(user.username, msg));

  });

  //Runs when client disconnects from the Livechat.
  socket.on('disconnect', () =>{

    const user = disconnectUser(socket.id);

    if(user) {

      io.to(user.room).emit('message', styleChat(livechatBot, `${user.username} has left the chat.`));

    // Send users and room info.
    io.to(user.room).emit('roomUsers', {

      room: user.room,

      users: usersInRoom(user.room)

    });

  }
  
  });

});

//Passport Configuration.
require('./loginconfiguration/passportmiddleware') (passport);


// DB Configuration.
const db = require('./loginconfiguration/connect').MongoURI; //Used to connect to the MongoDB Atlas Database using URI link.


// Connect to MongoDB Atlas Database using URI link.
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })

    .then(() => console.log('MongoDB Atlas Database Connected')) //Log to console when MongoDB Database is connected. 

    .catch(err => console.log(err));


//EJS Setup.
app.use(expressLayouts);

app.set('view engine', 'ejs')


//Bodyparser Setup.
app.use(express.urlencoded({ extended: false }));


//Express Session Middleware Setup from Express Documentation.
app.use(

    session({

      secret: 'secret',

      resave: true,

      saveUninitialized: true

    })

  );


// Passport Middleware Setup.
app.use(passport.initialize());

app.use(passport.session());


//Connect Flash Setup used for Error Message Handling.
app.use(flash());


// Global Vars Used for Partials Messages when handling login/registration errors.
app.use(function(req, res, next) {

    res.locals.success_msg = req.flash('success_msg'); //Used to style when the outcome is succsesful. 

    res.locals.error_msg = req.flash('error_msg'); //Used to style when the outcome is an error. 

    res.locals.error = req.flash('error'); //Used to style when the outcome is an error. 

    next();

  });


//Routes for navigating between EJS files.
app.use('/', require('./routes/mainroute')); //Redirect for localhost:5000.

app.use('/users', require('./routes/userroute')); //Redirect for views folder. 


//Port for Localhost Connection.
const PORT = process.env.PORT || 5000; //Setting host port to 5000.

server.listen(PORT, console.log(`Server started on port ${PORT}`)); //Log the port to console to show that the node.js server has begun. 