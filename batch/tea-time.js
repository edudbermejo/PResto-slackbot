const http = require("http");

exports.englishBreakfast = () => {
  setInterval(function() {
      http.get(process.env.APP_URL);
  }, 3000000) // every 50 minutes 
}