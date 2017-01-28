(function(process, logger){
	'use strict';
	const path = require('path'),
		express = require('express'),
		fs = require('fs'),
		RedisDb = require('./lib/redis-db'),
		RestHelper = require('./lib/resthelper'),
		Entity = require('./lib/entity'),
		app = express(),
		config = require('./config.json'),
		publicpath = path.join(__dirname, config.httpserver.publicpath);

	let databasehandler = new RedisDb(config.redis);
	databasehandler.connect();
	let i = 0;

	try{
		for (i = config.entities.length - 1; i >= 0; i--) {
			let schema = JSON.parse(fs.readFileSync(config.entities[i].schema));
			let entity = new Entity(schema);
			let restHelper = new RestHelper(databasehandler, entity);
			app.get('/api/v1/' + config.entities[i].serviceprefix, restHelper.find() );
			app.get('/api/v1/' + config.entities[i].serviceprefix + '/:id', restHelper.getById() );
		}
	}catch(e){
		logger.error(e, config.entities[i]);
		logger.error('Some of the entities have not been properly loaded');
		process.exit(-1);
	}


	app.use('/', express.static(publicpath));
	app.get('*', function(req, res){
		res.sendFile( "index.html", {root: publicpath });
	});
	app.listen(config.httpserver.port, function () {
		logger.log('Example app listening on port', config.httpserver.port, '!');
	});
})(process, console);