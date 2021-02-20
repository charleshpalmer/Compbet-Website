//Imports
const LocalStrategy = require('passport-local').Strategy;

const mongoose = require('mongoose');

const bcrypt = require('bcryptjs'); 


//Load the user schema from the schemas folder.
const User = require('../schemas/userSchema');


//Error Handling with User Login
module.exports = function(passport) { //For passport.js middleware.

    passport.use(

        new LocalStrategy({ usernameField: 'email' } , (email, password, done) => { //Creating a local strategy for authentication using email and password.

            //Match Entered Email to Emails stored within the database.
            User.findOne({ email: email })

                .then(user => {

                    if(!user) { //Check to see if the entered email already exists.

                        return done(null, false, { message: 'That email is not registered..' }); //Error message is email has not been used to create an account. 

                    }

                    //Does the entered password match the hashed stored password?
                    bcrypt.compare(password, user.password, (err, isMatch) => {

                        if(err) throw err;

                        if(isMatch) { //If entered password matches stored password.

                            return done(null, user);

                        }

                        else { //If entered password does not match stored password. 

                            return done(null, false, { message: 'Password Incorrect' }); //Error message if entered password is incorrect. 

                        }

                    });

                })

                .catch(err => console.log(err)); //Log error to console.

        })

    );

    passport.serializeUser(function(user, done) { //Serialize the user when they log in, passing in user and done into the function.

        done(null, user.id);

      });
    
      passport.deserializeUser(function(id, done) { //Deserialize when the user logs out, passing id and done into the function.

        User.findById(id, function(err, user) { //Use the findById method to deserialize the user after logout.

          done(err, user);

        });

      });

    };

