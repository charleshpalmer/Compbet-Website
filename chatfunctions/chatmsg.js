const moment = require('moment');

function styleChat(username, text) { //Creating styleChat function and passing in the varaiables username and text.

    return {username, text, time: moment().format('hh:mm a')}; //Formatting the message header and using the moment middleware to get the current time, and formatting it with hour, minuite and the am/pm prefix.

  }
  
  module.exports = styleChat; //Exporting the function so it can be used in other .js pages.