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
				for (let i = 1, j = entity.keys.length; i < j; i++){
					let attr = entity.keys[i];
					if (typeof data[attr] !== 'undefined' && data[attr] !== ''){
						let value = data[attr];
						let values = [ value ];
						if (typeof entity.config.schema[ attr ].splitBy !== 'undefined' && entity.config.schema[ attr ].splitBy !== ''){
							values = value.split( entity.config.schema[ attr ].splitBy ).map(function(str){
								for (let i = 0, j = entity.config.schema[ attr ].remove.length; i < j; i++){
									str = str.replace(entity.config.schema[ attr ].remove[i], '');
								}
								return str;
							});
						}
						for (let q = 0, w = values.length; q < w; q++){
							let setname = attr + '|' + values[q];
							db.addToSet(entity, setname, data);
						}
					}	
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
