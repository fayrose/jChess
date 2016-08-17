var express = require('express');

var app = express();

var PORT = 8080;

app.use(express.static(__dirname + "./../app"));

app.listen(PORT, function() {
  console.log("Server started at http://localhost:" + PORT)
  console.log("To stop server press Ctrl + C")
})
