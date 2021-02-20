module.exports = {

    checkAuthentication: function(req, res, next) { //Creating a function called checkAuthentication to manage access to protected pages.

        if(req.isAuthenticated()) { //If the user is logged in to a valid account.

            return next(); //Proceed with access.

        }

        req.flash('error_msg', 'Please log into a user account in order to access this page!'); //Display error message to user if not logged in. 

        res.redirect('/users/login'); //Redirect the user to the login page. 
    }

}