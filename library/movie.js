'use strict'

const axios = require('axios');

function movies(request, response, next) {

    let cityMovie = request.query.city;
    let movieUrl = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&language=en-US&query=${cityMovie}&page=1&include_adult=false`;

    axios.get(movieUrl)
        .then(data => {
            let movieData = data.data.results.map(movie => new Movie(movie));
            response.status(200).send(movieData);
        })
        .catch(error => next(error));
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