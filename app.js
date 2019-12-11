const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv/config');

app.use(cors());
app.use(bodyParser.json());

// Import Routes
const postsRoute = require('./routes/post');
app.use('/posts', postsRoute);

// Routes
app.get('/', (req, res) =>{
    res.send('We are on home');
});

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