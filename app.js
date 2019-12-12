const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv/config');

app.use(cors());
app.use(bodyParser.json());

// Import Routes
const authRoute = require('./routes/auth');
const shipmentRoute = require('./routes/shipment');
const documentationRoute = require('./routes/documentation');

// Middleware
app.use(express.json());

// Route Middleware
app.use('/', documentationRoute);
app.use('/api/user', authRoute);
app.use('/api/shipment', shipmentRoute);

// Connect to DB
mongoose.connect(
    process.env.DB_CONNECTION, 
    { useNewUrlParser: true, useUnifiedTopology: true }, 
    () => { console.log('Connected to MLab')
});

// Server
app.listen( process.env.PORT, () => {
    console.log(`Server is up and running on port ${process.env.PORT}`);
} );