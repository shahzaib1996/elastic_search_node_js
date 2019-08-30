var express = require('express');
var app = express();
var routes = require('./routes');

const port = 3000;
 
// app.get('/', function (req, res) {
//   res.send('Hello World')
// })

app.use( '/api', routes );
 
app.listen(port, () => console.log('App Listening on port '+port) );