'use strict'

const axios = require('axios');

function weather(request, response, next) {

    let lat = request.query.lat;
    let lon = request.query.lon;

    let weatherUrl = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}&days=10`;
    console.log(request.query);

    axios.get(weatherUrl)
        .then(data => {
            let formattedData = data.data.data.map(city => new Forecast(city));
            response.status(200).send(formattedData);
        })
        .catch(error => next(error));
};

//create formatted data
class Forecast {
    constructor(city) {
        this.date = city.valid_date;
        this.description = city.weather.description;
    }
};

module.exports = weather;