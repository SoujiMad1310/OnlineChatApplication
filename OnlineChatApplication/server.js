const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
//const ChatInfor = require('./schemeModels/scheme_models')

// set the socket to expresss
app.set('socketio', io);

// define the URL
var databaseUrl = 'mongodb://127.0.0.1:27017/OnlineChat'
const PORTNUMBER = 3000;

// Connect to the database 
mongoose.connect(databaseUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("The database is connected successfully!!!");
}).catch(err => {
  console.log('The connection to database is unsuccess!!!. Exiting now...', err);
  process.exit();
});

// Set the connection to the index.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

// When the socket is connected, display the successfull 
// message to the console. 
io.on('connection', () => {
  console.log('Connected to a User...');
})

// Define the modle for the mongoose.   
var Message = mongoose.model('Message', { name: String, message: String });

// Define the parser
app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(bodyParser.urlencoded({ extended: true }))

// Define the array
messages = [];

// post method of express to post the messages to
// other chat groups and to store the data into the
// database. 
app.post('/messages', (req, res) => {
  var messageModelObject = new Message(req.body);
  io.sockets.emit("sendMessage",)
  messageModelObject.save()
    .then(() => {
      console.log("Data is saved to the database successfully. ");

      // push the obtained into messages 
      messages.push(req.body);

      // emit the body of the json.
      io.emit('message', req.body);
      res.sendStatus(200);
    })
    // If there is any error, display the message at the console. 
    .catch((err) => {
      console.log("There was an error saving the msg object to the database");
      console.log("Sending 500 status code");
      res.sendStatus(500);
    });
});

// If there are any bad words, display the error message 
app.post('/messages', async (req, res) => {
  try {
    var message = new Message(req.body);
    await message.save()
    var censored = await Message.findOne({ message: 'badword' });
    if (censored)
      await Message.remove({ _id: censored.id })
    else
      io.emit('message', req.body);
    res.sendStatus(200);
  }
  catch (error) {
    res.sendStatus(500);
    return console.log('error', error);
  }
  finally {
    console.log('Message send')
  }
})

// Set the port number to listining for http.
http.listen(PORTNUMBER, function () {
  console.log("Listening to the application at: http://localhost:", PORTNUMBER);
});