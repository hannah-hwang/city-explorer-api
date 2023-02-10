'use strict'

//.env library access
require('dotenv').config();

//express server library
const express = require('express');

//initializing express library
const app = express();

//bringing in cors
const cors = require('cors');

//allowing any url to make requests in the server
app.use(cors());

//defining what port this will run on
const PORT = process.env.PORT || 3002;

//bringing in modules
const weather = require('./library/weather');
const movies = require('./library/movie');

//default route
app.get('/', (request, response) => {
    response.send('default server working');
});

//get requests
app.get('/weather', weather);
app.get('/movies', movies);


//app will listen on the port that was defined
app.listen(PORT, () => console.log(`listening on ${PORT}`));