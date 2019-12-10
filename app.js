const express = require('express');
const mongoose = require('mongoose');
require('dotenv/config');

const app = express();

// Routes
app.get('/', (req, res) =>{
    res.send('We are on home');
});

app.get('/posts', (req, res) =>{
    res.send('We are on posts');
});

// Connect to DB
mongoose.connect(
    process.env.DB_CONNECTION, 
    { useNewUrlParser: true, useUnifiedTopology: true }, 
    () => { console.log('Connected to MLab')
});

// Server
app.listen(3000);