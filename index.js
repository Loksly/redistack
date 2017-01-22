(function(){
	'use strict';
	const path = require('path'),
		express = require('express'),
		app = express(),
		config = require('config.json');


	app.use('/static', express.static(path.join(__dirname, 'public')));
	app.listen(config.httpserver.port, function () {
		console.log('Example app listening on port', config.httpserver.port, '!');
	});
})();