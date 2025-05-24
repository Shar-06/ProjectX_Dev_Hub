const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const { containerClient } = require('./src/config/azureStorage.js');
require('dotenv').config();



const userRouter = require('./src/api/routes/user.routes.js');
const bookingRouter = require('./src/api/routes/booking.routes.js');
const reportRouter = require('./src/api/routes/report.routes.js');
const eventRouter = require('./src/api/routes/event.routes.js');
const notificationRouter = require('./src/api/routes/notification.routes.js');
const reportingRouter = require('./src/api/routes/reporting.routes.js');
const maintenanceReportRouter = require('./src/api/routes/maintenance.routes.js');
const usageTrendsRouter = require('./src/api/routes/usagetrend.routes.js');

//Instantiate a new express app
const app = express();
app.use(express.json());

app.use(morgan('combined'));
app.use(cors());

//Route registration [v1]
app.use('/api/v1/users', userRouter);
app.use('/api/v1/bookings', bookingRouter);
app.use('/api/v1/reports',reportRouter);
app.use('/api/v1/events',eventRouter);
app.use('/api/v1/notifications',notificationRouter);
app.use('/api/v1/reporting',reportingRouter);
app.use('/api/v1/usagetrends',usageTrendsRouter);
app.use('/api/v1/maintenances',maintenanceReportRouter);

//file to start in
app.use(express.static(path.join(__dirname, 'public')));

//file to open at start
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html', 'LoginPage.html'));
  });

//Configure port and database connection
const PORT = process.env.PORT || 3500;

//Open up the server to listen for requests
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});





