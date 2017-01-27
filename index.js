(function(){
	'use strict';
	const path = require('path'),
		express = require('express'),
		RedisDb = require('./lib/redis-db'),
		RestHelper = require('./lib/resthelper'),
		Entity = require('./lib/entity'),
		PostSchema = require('./lib/classes/post-schema'),

		app = express(),
		config = require('./config.json');

	let databasehandler = new RedisDb(config.redis);
	databasehandler.connect();

	let postType = new Entity(PostSchema);
	let postRestHelper = new RestHelper(databasehandler, postType);


	app.get('/api/v1/questions', postRestHelper.find(function(obj){ console.log(obj.PostTypeId); return obj.PostTypeId === "1"; }) );
	app.get('/api/v1/questions/:id', postRestHelper.getById() );

	app.use('/', express.static(path.join(__dirname, 'public')));
	app.listen(config.httpserver.port, function () {
		console.log('Example app listening on port', config.httpserver.port, '!');
	});
})();