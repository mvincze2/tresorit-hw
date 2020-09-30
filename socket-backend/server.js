var app = require('express')();
const bodyParser = require('body-parser');
var http = require('http').createServer(app);
var io = require('socket.io')(http);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}) );

//to not have problems with CORS
app.all("/*", function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, X-Requested-With');
  next();
});

//Storing url key here as I only have one message stored, instead we could be storing multiple values with a map, with urkKey as key, or have them stored in a database
var urlKey = '';
var message = '';
var hmac;

app.post('/createDocument', function (req, res) {
  urlKey = req.body["id"];
  hmac = req.body["hmac"]
  message = '';
  res.send(req.body)
})

app.get('/getDocument/:id', (req, res) => {
  if(urlKey == req.params['id']){
    res.json({'message': message, "hmac": hmac, "url" : urlKey})
  } else {
    //Sending 404 not found if the requested url does not match the stored url
    res.status(404).send({
      message: 'This is an error!'
   });
  }
})

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('message', (msg, hash, usedUrl) => {
    if(usedUrl == urlKey){
      message =  msg;
      hmac = hash;
      socket.broadcast.emit('message-broadcast', message, hmac, urlKey);
    }
   });
});



http.listen(3000, () => {
  console.log('listening on *:3000');
});


