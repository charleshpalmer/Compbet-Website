//Importing neccesary packages.

const express = require('express');
const User = require('../schemas/userSchema');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

//User Model
const user = require('../schemas/userSchema');


//Login System

    //Login Page
    router.get('/login', (req, res) => res.render('login'));

    //Register Page
    router.get('/register', (req, res) => res.render('register'));

    //Welcome Page
    router.get('/welcome', (req, res) => res.render('welcome'));


//Navigation & Views System

    //Home Page
    router.get('/index', (req, res) => res.render('index'));

    //About Page
    router.get('/about', (req, res) => res.render('about'));

    //Services Page
    router.get('/services', (req, res) => res.render('services'));

    //Games Page
    router.get('/games', (req, res) => res.render('games'));

    //Contact Page
    router.get('/contact', (req, res) => res.render('contact'));

    //Blackjack Page
    router.get('/blackjack', (req, res) => res.render('blackjack'));

    //Texas Page
    router.get('/texas', (req, res) => res.render('texas'));

    //Roulette Page
    router.get('/roulette', (req, res) => res.render('roulette'));


// Handle for User Registration
router.post('/register', (req, res) => {

    const { name, email, password, confirmpassword } = req.body;

    let errors = []; //Create an array to store errors.

    
    //Check that required fields have been filled.
    if(!name || !email || !password || !confirmpassword) {

        errors.push({ msg: 'Please fill in all fields!'});

    }

    //Check if the first password matches the second password.
    if(password !== confirmpassword) {

        errors.push({ msg: 'Passwords do not match!'});

    }

    //Check that the password is longer than eight characters.
    if(password.length < 8) {

        errors.push({ msg: 'Password should be at least eight characters long!'}); //Message to user if requirements are not met. 

    }

    if(errors.length > 0) { //If there are errors present in the entered data

        res.render('register', { //Redirect to register page and submit error. 

            errors, name, email, password, confirmpassword

        })

    }

    else{

        //If all form validation has passed
        User.findOne({ email: email })
        
            .then(user => {

                if(user) {

                    //If the user already exists in the database with the details provided. 
                    errors.push({ msg: 'Email is already registered in the MongoDB Database!'});

                    res.render('register', { //Redirect to register page and submit error.

                        errors, name, email, password, confirmpassword
            
                    });

                }

                else {

                    const newUser = new User({ //Create new user object containing name, email and password. 

                        name, email, password

                    });

                    //Hash the users entered password
                    bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {  //Generate salt and hashed password. 

                        if(err) throw err;

                        //Reset the password variable to the new hashed value.
                        newUser.password = hash;

                        //Save the new user to the database using the .save method.
                        newUser.save()

                            .then(user => {

                                req.flash('success_msg', 'You are now registered and can log in!'); //Display message to user confirming registration. 

                                res.redirect('/users/login'); //Redirect user to login page. 

                            })

                            .catch(err => console.log(err));


                     }))

                }

            });

    }

});

//Handle to deal with the user login process.
router.post('/login', (req, res, next) => {

    passport.authenticate('local', {

        successRedirect: '/dashboard', //If passport.js middleware operation passes and user is authenticated. 

        failureRedirect: '/users/login', //If passport.js authentication fails. 

        failureFlash: true

    }) (req, res, next);

});

//Handle to deal with the user logout process.
router.get('/logout', (req, res) => {

    req.logout();

    req.flash('success_msg', 'You have been logged out..'); //Display message to user on succsesful logout. 

    res.redirect('/users/login'); //Redirect user to login page. 

});

module.exports = router;