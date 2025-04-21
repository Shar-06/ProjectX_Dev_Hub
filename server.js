const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const userRouter = require('./src/api/routes/user.routes.js');
const bookingRouter = require('./src/api/routes/booking.routes.js');


//Instantiate a new express app
const app = express();
app.use(express.json());
app.use(morgan('combined'));
app.use(cors());

//Route registration [v1]
app.use('/api/v1/users', userRouter);
app.use('/api/v1/bookings', bookingRouter);

//Middleware setup
//app.use(express.static('public/html'));
//app.use(express.static(path.join(__dirname, 'public/html')));
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html', 'admin-bookings.html'));
  });

//Configure port and database connection
const PORT = process.env.PORT || 3500;

//Open up the server to listen for requests
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});



