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

io.on('connection', (socket) => {
	socket.on('chat message', (msg) => {
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

			io.emit('chat message', body);
		});
		// io.emit('chat message', msg);
	});
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});