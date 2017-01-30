(function(process, logger){
	const csv = require('csv'),
		fs = require('fs'),
		zlib = require('zlib'),
		Q = require('q'),
		RedisDb = require('./lib/redis-db'),
		config = require('./config.json'),
		Entity = require('./lib/entity')
		;

	function processFile(entity, filename, db){
		let gunzip = zlib.createGunzip();
		let parser = csv.parse({columns: true}),
			rs = fs.createReadStream(filename),
			defer = Q.defer();

		rs.pipe(gunzip).pipe(parser);
		parser.on('readable', function(){
			while(data = parser.read()){
				db
					.saveEntity(entity, data)
					.then(function(){
						logger.log(data.Id);
					});
				//parche
				if (typeof data.PostTypeId !== 'undefined' && data.PostTypeId === "1"){
					db.addToSet(entity, 'PostTypeId1', data);
				}
			}
		});
		parser.on('end', function(){
			defer.resolve();	
		});
		return defer.promise;
	}


	let db = new RedisDb(config.redis);
	db.connect();

	let loadingTasks = [];

	for (i = config.loader.metadata.files.length - 1; i >= 0; i--) {
		let service = config.loader.metadata.files[i].service;
		let filename = config.loader.metadata.files[i].filename;

		let schemadetails = config.entities.filter(function(e){ return e.serviceprefix === service; })[0];

		let schema = JSON.parse(fs.readFileSync(schemadetails.schema));
		let entity = new Entity(schema);
			
		loadingTasks.push( processFile(entity, filename, db) );
	}

	Q.all(loadingTasks).then(function(){
		setTimeout(function(){
			db.disconnect();
		}, 1000);
	});


})(process, console);
