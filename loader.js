(function(process){
	const csv = require('csv'),
		fs = require('fs'),
		Redis = require('ioredis'),
		config = require('./config.json');

	if (process.argv.length < 4){
		console.log("Missing arguments", process.argv[0], process.argv[1], "file");
		process.exit(-1);
	}

	let parser = csv.parse({columns: true}),
		rs = fs.createReadStream(process.argv[2]),
		redis = new Redis(config.redis);
		prefix = typeof process.argv[3] === 'string' ? process.argv[3] : '';

	
	rs.on('readable', function(){
		while(data = rs.read()){
			parser.write(data);
		}
	});

	parser.on('readable', function(){
		while(data = parser.read()){
			for(let attr in data){
			//	redis.set(prefix + data.id)
				console.log(prefix + data.Id + ':' + attr, '=', data[attr]);
			}
			process.exit(-1);
		}
	});


	
})(process);
