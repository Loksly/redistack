(function(process, logger){
	const csv = require('csv'),
		fs = require('fs'),
		RedisDb = require('./lib/redis-db'),
		config = require('./config.json'),
		Entity = require('./lib/entity'),
		PostSchema = require('./lib/classes/post-schema');

	if (process.argv.length < 3){
		console.log("Missing arguments", process.argv[0], process.argv[1], "file");
		process.exit(-1);
	}

	let postType = new Entity(PostSchema);

	let parser = csv.parse({columns: true}),
		rs = fs.createReadStream(process.argv[2]),
		db = new RedisDb(config.redis);

	db.connect();
	
	rs.on('readable', function(){
		while(data = rs.read()){
			parser.write(data);
		}
	});

	parser.on('readable', function(){
		while(data = parser.read()){
			db
				.saveEntity(postType, data)
				.then(function(){
					logger.log(data.Id);
				});
			if (data.PostTypeId === "1"){
				db.addToSet(postType, 'PostTypeId1', data);
			}
		}
	});

	parser.on('end', function(){
		setTimeout(function(){
			db.disconnect();
		}, 1000);
	});


})(process, console);
