(function(module, logger){
	'use strict';
	const Redis = require('ioredis'),
		Q = require('q');

	function RedisDb(config){
		this.config = config;
	}

	RedisDb.prototype.connect = function(){
		this.connection = new Redis(this.config);
	};

	RedisDb.prototype.disconnect = function(){
		this.connection.quit();
	};

	RedisDb.prototype.cbHandler = function(defer){
		let instance = this;
		return function(err, data){
			if (instance.config.debug){
				logger.log(err, data);
			}
			if (err){
				defer.reject(err);
			}else{
				defer.resolve(data);
			}
		};
	}

	RedisDb.prototype.saveEntity = function(entity, obj){
		let instance = this;
		let defer = Q.defer();
		let attrs = entity.getAttributes();
		let prefix = entity.getPrefix();
		let keyfield = entity.getKeyField();
		instance.connection.hmset(prefix + ':' + obj[keyfield], obj, instance.cbHandler(defer) );
		return defer.promise;
	};

	RedisDb.prototype.membersOfSet = function(entity, setname){
		let instance = this;
		let defer = Q.defer();
		let prefix = entity.getPrefix();
		let keyfield = entity.getKeyField();
		instance.connection.smembers(prefix + ':' + setname, instance.cbHandler(defer) );
		return defer.promise;
	};

	RedisDb.prototype.addToSet = function(entity, setname, obj){
		let instance = this;
		let defer = Q.defer();
		let prefix = entity.getPrefix();
		let keyfield = entity.getKeyField();
		let value = obj[keyfield];
		instance.connection.sadd(prefix + ':' + setname, obj[keyfield], instance.cbHandler(defer) );
		return defer.promise;
	};

	RedisDb.prototype.removeFromSet = function(entity, setname, obj){
		let instance = this;
		let defer = Q.defer();
		let prefix = entity.getPrefix();
		let keyfield = entity.getKeyField();
		let value = obj[keyfield];
		instance.connection.srem(prefix + ':' + setname, obj[keyfield], instance.cbHandler(defer) );
		return defer.promise;
	};

	RedisDb.prototype.belongsToSet = function(entity, setname, obj){
		let instance = this;
		let defer = Q.defer();
		let prefix = entity.getPrefix();
		let keyfield = entity.getKeyField();
		let value = obj[keyfield];
		instance.connection.sismember(prefix + ':' + setname, obj[keyfield], instance.cbHandler(defer) );
		return defer.promise;
	};

	RedisDb.prototype.matchSet = function(entity, restriction, cursoridx){
		let instance = this;
		let defer = Q.defer();
		let prefix = entity.getPrefix();
		let keyfield = entity.getKeyField();
		let value = obj[keyfield];
		instance.connection.sadd(prefix, obj[keyfield], instance.cbHandler(defer) );
		return defer.promise;
	};

	RedisDb.prototype.findByKey = function(entity, value){
		let instance = this;
		let defer = Q.defer();
		let prefix = entity.getPrefix();
		let keyvalue = value.indexOf(prefix) === 0 ? value : (prefix + ':' + value);
		instance.connection.hgetall(keyvalue, instance.cbHandler(defer));
		return defer.promise;
	};

	Redis.prototype.findKeysByRestriction = function(entity, restriction){
		let instance = this;
		let defer = Q.defer();
		let prefix = entity.getPrefix();
		let keyvalue = value.indexOf(prefix) === 0 ? value : (prefix + ':' + value);
		instance.connection.hscan(keyvalue, instance.cbHandler(defer));
		return defer.promise;
	}

	RedisDb.prototype.findAll = function(entity){
		let instance = this;
		let defer = Q.defer();
		let prefix = entity.getPrefix();
		instance.connection.keys(prefix + ':*', instance.cbHandler(defer));
		return defer.promise;
	};

	RedisDb.prototype.flush = function(){
		let instance = this;
		let defer = Q.defer();
		instance.connection.flush(instance.cbHandler(defer));
		return defer.promise;
	};

	module.exports = RedisDb;

})(module, console);
