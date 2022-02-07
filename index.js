const wcc = require('world-countries-capitals')
const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const request = require('request');

const io = new Server(server);

app.use(express.static(path.join(__dirname, '/public')));

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
			'x-rapidapi-key': process.env.RAPID_KEY,
			useQueryString: true
		}
	};

	request(options, (error, response, body) => {
		if (error) throw new Error(error);

		const weatherInfo = JSON.parse(body);
		io.emit('weather info', weatherInfo);
	});
	
};

io.on('connection', (socket) => {
	socket.on('ping', () => {
		getWeather();
	})
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});