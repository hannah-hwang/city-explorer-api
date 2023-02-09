'use strict'

//.env library access
require('dotenv').config();

//express server library
const express = require('express');

//initializing express library
const app = express();

const axios = require('axios');

//bringing in cors
const cors = require('cors');

//allowing any url to make requests in the server
app.use(cors());

//defining what port this will run on
const PORT = process.env.PORT || 3002;


//default route
app.get('/', (request, response) => {
    response.send('default server working');
});


app.get('/weather', weather);
async function weather(request, response, next) {

    let lat = request.query.lat;
    let lon = request.query.lon;

    let weatherUrl = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}&days=10`;
    console.log(request.query);

    try {
        let weatherResponse = await axios.get(weatherUrl);
        let formattedData = weatherResponse.data.data.map(city => new Forecast(city));
        response.status(200).send(formattedData);
    }
    catch (error) {
        next(error)
    }

};

app.get('/movies', movies);
async function movies(request, response, next) {
    let cityMovie = request.query.city;
    let movieUrl = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&language=en-US&query=${cityMovie}&page=1&include_adult=false`;
    try {
        console.log(movieUrl);
        let movieResponse = await axios.get(movieUrl);
        let movieData = movieResponse.data.results.map(movie => new Movie(movie));
        response.status(200).send(movieData);

    }
    catch (error) {
        next(error)
    }
};

//create formatted data
class Forecast {
    constructor(city) {
        this.date = city.valid_date;
        this.description = city.weather.description;
    }
}

class Movie {
    constructor(movie) {
        this.title = movie.title;
        this.overview = movie.overview;
        this.average_votes = movie.vote_average;
        this.total_votes = movie.vote_count;
        this.image_url = movie.poster_path;
        this.popularity = movie.popularity;
        this.released_on = movie.release_date;

    }
}

//app will listen on the port that was defined
app.listen(PORT, () => console.log(`listening on ${PORT}`));