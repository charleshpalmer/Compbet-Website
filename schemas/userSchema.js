const mongoose = require('mongoose'); //Require the mongoose module. 

const UserSchema = new mongoose.Schema({ //Creating a Schema for user login. 

    name: {type: String, required: true},

    email: {type: String, required: true},

    password: {type: String, required: true},

    date: {type: Date, default: Date.now}

});

const User = mongoose.model('User', UserSchema); //Saving the model containing User and the User Schema to a variable "User".

module.exports = User; //Exporting "User" variable to be used elsewhere. 