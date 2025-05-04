const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const http = require("http");
const socketIO = require("socket.io");
require('dotenv').config();

const userRouter = require('./src/api/routes/user.routes.js');
const bookingRouter = require('./src/api/routes/booking.routes.js');
const notificationRouter = require('./src/api/routes/notification.routes.js');

//Instantiate a new express app
const app = express();
app.use(express.json());
app.use(morgan('combined'));
app.use(cors());

//Route registration [v1]
app.use('/api/v1/users', userRouter);
app.use('/api/v1/bookings', bookingRouter);
app.use('/api/v1/notifications',notificationRouter);
//file to start in
app.use(express.static(path.join(__dirname, 'public')));

//file to open at start
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html', 'LoginPage.html'));
  });

//Configure port and database connection
const PORT = process.env.PORT || 3500;

let server = http.createServer(app);
let io = socketIO(server);

//Socket.io connection
io.on('connection', (socket) => {
  console.log('A new user just connected');

  socket.on('createNewUser', () => {
    console.log('New user signed up');
  });
  socket.on('createNewUser', (message) => {
    console.log('New user signed up:', message);

    socket.broadcast.emit('newUserCreated', {
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime()
    })
  });
});

server.listen(PORT, () =>{
  console.log(`SocketIO server is running on PORT ${PORT}`);
});




