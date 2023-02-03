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

//bring in weather data
const weather = require('./data/weather.json');

//default route
app.get('/', (request, response) => {
    response.send('default server working');
});

// app.get('/weatherData')

// app.get('/weatherData', (request, response) => {
//     response.send(weatherData);
// });

app.get('/weather', (request, response, next) => {
    try {

        console.log(request.query);
        // let lat = request.query.lat;
        // let lon = request.query.lon;
        let city = request.query.searchQuery;
        let myCity = new Forecast(city);
        let formattedCity = myCity.getItems();
        response.status(200).send(formattedCity);
    }
    catch (error) {
        next(error)
    }

});

//create formatted data
class Forecast {
    constructor(city) {
        console.log(city);
        let newList = weather.find(list => list.city_name === city);
        this.cityForecast = newList;
        console.log(this.cityForecast)
    }
    getItems() {
        return this.cityForecast.data.map(item => {
            return { date: item.valid_date, description: item.weather.description }
        });
    }

}

app.use((error, request, response, next) => {
    console.log(error);
    response.status(500).send(error)
})
//app will listen on the port that was defined
app.listen(PORT, () => console.log(`listening on ${PORT}`));