const express = require('express');

const router = express.Router();

const { checkAuthentication } = require('../loginconfiguration/loginauth'); //Provides the path to the authentication file system. 

//Route used to display welcome page.
router.get('/', (req, res) => res.render('index'));

//Route used to display dashboard page.
router.get('/dashboard', checkAuthentication, (req, res) => res.render('dashboard', {name: req.user.name}));

//Export the page so the content can be used on other .js file.
module.exports = router;