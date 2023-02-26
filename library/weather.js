'use strict'

const axios = require('axios');
const cache = require('../cache');

function weather(request, response, next) {

    let lat = request.query.lat;
    let lon = request.query.lon;

    let weatherUrl = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}&days=10`;
    console.log(request.query);

    const key = `weather-` + lat + lon;

    if (cache[key] && (Date.now() - cache[key].timestamp < 60000)) {
        console.log('cache hit - send cached data');
        response.status(200).send(cache[key].data);
    }
    else {
        console.log('cache miss - make new request to API and cache data');
        axios.get(weatherUrl)
            .then(data => {
                let formattedData = data.data.data.map(city => new Forecast(city));
                cache[key] = {};
                cache[key].timestamp = Date.now();
                cache[key].data = formattedData;
                response.status(200).send(formattedData);
            })
            .catch(error => next(error));
    }


};

//create formatted data
class Forecast {
    constructor(city) {
        this.date = city.valid_date;
        this.description = city.weather.description;
    }
};

module.exports = weather;