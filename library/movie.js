'use strict'

const axios = require('axios');
const cache = require('../cache');

function movies(request, response, next) {

    let cityMovie = request.query.city;
    let movieUrl = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&language=en-US&query=${cityMovie}&page=1&include_adult=false`;

    const key = 'movie-' + cityMovie;

    if (cache[key] && (Date.now() - cache[key].timestamp < 60000)) {
        console.log('cache hit - send cached data');
        response.status(200).send(cache[key].data);
    }
    else {
        console.log('cache miss - make new request to API and cache data');
        axios.get(movieUrl)
            .then(data => {
                let movieData = data.data.results.map(movie => new Movie(movie));
                cache[key] = {};
                cache[key].timestamp = Date.now();
                cache[key].data = movieData;
                response.status(200).send(movieData);
            })
            .catch(error => next(error));
    }
};

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

module.exports = movies;