
function drawHill(ctx, x, y, radius) {
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, Math.PI, true);
	ctx.fill();
}

function drawHills (ctx, color) {
	ctx.shadowColor = 'black';
	ctx.shadowBlur = 10;
	ctx.fillStyle = color[0];
	drawHill(ctx, 120, 360, 140);
	drawHill(ctx, 300, 350, 145);
	ctx.fillStyle = color[1];
	drawHill(ctx, 40, 400, 120, 0);
	drawHill(ctx, 200, 400, 130);
	drawHill(ctx, 350, 400, 120);
}

function drawSun (ctx, color) {
	ctx.shadowColor = '#ffffff';
	ctx.fillStyle = color;
	ctx.beginPath()
	ctx.arc(80, 80, 40, 0, 2 * Math.PI, true);
	ctx.fill();
}

function drawClouds (ctx, color) {
	ctx.shadowBlur = 5;
	const cloudPos = [ [200, 90], [120, 100], [300, 100] ];
	ctx.shadowColor = '#dcdbd4';
	ctx.fillStyle = color;
	for (const pos of cloudPos) {
		ctx.beginPath();
		ctx.arc(pos[0], pos[1], 30, Math.PI * 0.5, Math.PI * 1.5);
		ctx.arc(pos[0] + 35, pos[1] - 30, 35, Math.PI * 1, Math.PI * 1.85);
		ctx.arc(pos[0] + 76, pos[1] - 22, 25, Math.PI * 1.37, Math.PI * 1.91);
		ctx.arc(pos[0] + 100, pos[1], 30, Math.PI * 1.5, Math.PI * 0.5);
		ctx.moveTo(pos[0] + 100, pos[1] + 30);
		ctx.lineTo(pos[0], pos[1] + 30);
		
		ctx.fill()
	}
}

function drawSnowFlakes (ctx, mp, particles) {
	ctx.fillStyle = '#ffffff';
	ctx.beginPath();
	for(let i = 0; i < mp; i++)
	{
		const p = particles[i];
		ctx.moveTo(p.x, p.y);
		ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);
	}
	ctx.fill();
}

function drawSnow (ctx, width, height) {
	const mp = 100;
	const particles = [];
	for(let i = 0; i < mp; i++)
	{
		particles.push({
			x: Math.random() * (width -100) + 100,
			y: Math.random() * (height -90) + 90,
			r: Math.random() * 3,
			d: Math.random() * mp
		})
	}
	drawSnowFlakes(ctx, mp, particles);
}

function drawRainDrop (ctx, mp, particles) {
	ctx.shadowBlur = 0;
	ctx.fillStyle = '#1E90FF';
	ctx.beginPath();
	for(let i = 0; i < mp; i++)
	{
		const p = particles[i];
		ctx.moveTo(p.x - 3, p.y);
		ctx.lineTo(p.x, p.y - 5);
		ctx.lineTo(p.x + 3, p.y);
		ctx.arc(p.x, p.y, 3, 0, Math.PI);		
	}
	ctx.fill();
}

function drawRain (ctx, width, height) {
	const mp = 150;
	const particles = [];
	for(let i = 0; i < mp; i++)
	{
		particles.push({
			x: Math.random() * (width -100) + 100,
			y: Math.random() * (height -90) + 90
		})
	}
	drawRainDrop(ctx, mp, particles);
}

function defineColors (json) {
	let scene = {};
	const weather = json.weather[0].main;
	const temp = json.main.temp;
	const night = true; 
	
	if (night) {
		scene.color = '#131862';
		scene.sun = '#91a3b0';
		scene.cloud = '#546bab';
		scene.hill = ['#2e4482', '#546bab'];
		
	}
	else {
		scene.color = '#48b4e0';
		scene.sun = "#FDB813";
		if (weather == "Rain" || weather == "Fog" || weather == "Smoke" || temp <= 0 || "rain" in json)
			scene.color = '#92BAD2';
			
		scene.cloud =  '#ffffff';
		if (weather == "Rain" || weather == "Thunderstorm" || weather == "Storm" || weather == "Fog"
		|| temp < 0 || "rain" in json)
			scene.cloud = '#cfcfc4';
		else if (weather == "Smoke")
			scene.cloud = '#9a9a9a';
		
		scene.hill = ["#6B8E23", "#9ACD32"];
		if (temp < 0)
			scene.hill = ['#dcdbd4', "#ffffff"];
		if (temp > 34)
			scene.hill = ['#a69150', "#c2b280"];
	}

	return scene;
}

function drawCanvas (json) {
	const canvas = document.getElementById("illustration");
	canvas.width = 400;
	canvas.height = 400;
	const ctx = canvas.getContext("2d");
	const weather = json.weather[0].main;
	const temp = json.main.temp;
	let scene = defineColors (json);

	ctx.fillStyle = scene.color;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	drawHills (ctx, scene.hill);
	drawSun(ctx, scene.sun);
	if (weather == "Rain" || "rain" in json) 
		drawRain(ctx, canvas.width, canvas.height);
	if (weather == "Snow" || "snow" in json)
		drawSnow(ctx, canvas.width, canvas.height);
	if (json.clouds.all > 10)
		drawClouds(ctx, scene.cloud);
}
