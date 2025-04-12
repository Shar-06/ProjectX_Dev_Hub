const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

require('dotenv').config();

const userRouter = require('./src/api/routes/user.routes.js');

//Instantiate a new express app
const app = express();

//Middleware setup
app.use(express.static('public'));
app.use(express.json());
app.use(morgan('combined'));
app.use(cors());

//Configure port and database connection
const PORT = process.env.PORT || 3500;

//Route registration [v1]
app.use('/api/v1/users', userRouter);

//Open up the server to listen for requests
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});



