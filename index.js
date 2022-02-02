const wcc = require('world-countries-capitals')
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const request = require('request');

const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

function getWeather () {
	country = wcc.getCountryDetailsByName(wcc.getRandomCountry());

	const options = {
		method: 'GET',
		url: 'https://community-open-weather-map.p.rapidapi.com/weather',
		qs: {
			q: `${country[0].capital}`,
			units: 'metric',
		},
		headers: {
			'x-rapidapi-host': 'community-open-weather-map.p.rapidapi.com',
			'x-rapidapi-key': '[your rapidapi key]',
			useQueryString: true
		}
	};

	request(options, function (error, response, body) {
		if (error) throw new Error(error);

		const weatherInfo = JSON.parse(body);
		io.emit('weather info', body);
	});
	
};

io.on('connection', (socket) => {
	getWeather();
	setInterval(() => {
		getWeather()},
		30000);
	
});

// setInterval(io.emit('weather info', "coucou"), 10000);

server.listen(3000, () => {
  console.log('listening on *:3000');
});