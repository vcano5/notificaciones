const express = require('express'),
	app = express();
	notifier = require('node-notifier'),
	bodyParser = require('body-parser'),
	request = require('request'),
	QRReader = require('qrcode-reader'),
	fs = require('fs'),
	jimp = require('jimp');


app.listen(4000);

app.use(bodyParser.json())

app.post('/notificar', function(req, res) { 
	if(req.body.data.status == 'succeeded') {
		notifier.notify({
		title: 'Heroku',
		message: 'Build correcto'
		})
	}
	else {
		notifier.notify({
			title: 'Heroku',
			message: 'Comenzando build'
		})
	}
	res.sendStatus(200)
})


var cdr = 'https://scontent-dfw5-1.xx.fbcdn.net/v/t1.15752-9/66434927_467594084029709_8894317730266611712_n.png?_nc_cat=102&_nc_oc=AQmY9wU9d-K_sWkuOhP1DN1lA7qsIZ5lFYpeF0rUSzx4xloE_Dq6-OM5kJhebN5w00ueutkU9SLvdDPIgPaVfVHK&_nc_ht=scontent-dfw5-1.xx&oh=081c05e34ed2f23faa59bf1571502bdc&oe=5DA5FC71'

readQR(cdr)

async function readQR(cqr) {
	const img = await jimp.read(cqr);
	const qr = new QRReader();

	const value = await new Promise((resolve, reject) => {
		qr.callback = (err, v) => err != null ? reject(err) : resolve(v);
		qr.decode(img.bitmap)
	})
	console.log(value.result)


	for (const point of value.points) {
	  img.scan(Math.floor(point.x) - 5, Math.floor(point.y) - 5, 10, 10, function(x, y, idx) {
	    // Modify the RGBA of all pixels in a 10px by 10px square around the 'FinderPattern'
	    this.bitmap.data[idx] = 255; // Set red to 255
	    this.bitmap.data[idx + 1] = 0; // Set green to 0
	    this.bitmap.data[idx + 2] = 0; // Set blue to 0
	    this.bitmap.data[idx + 3] = 255; // Set alpha to 255
	  });
	}

	await img.writeAsync('./qr_photo_annotated.png');
}

