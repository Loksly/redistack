(function(module, logger){
	'use strict';

	const Q = require('q'),
		SIZE = 30;

	function RestHelper(databasehandler, entity){
		this.databasehandler = databasehandler;
		this.entity = entity;
	}

	function failHandler(res){
		return function(err){
			logger.error(res, err);
			res.status(500).json(err).end();
		};
	}

	RestHelper.prototype.getById = function() {
		let instance = this;
		return function(req, res){
			if (typeof req.params.id === 'undefined'){
				res.status(404).end();
			} else {
				let id = req.params.id;
				instance
					.databasehandler
					.findByKey(instance.entity, id)
					.then(function(data){
						if (data){
							res.json(data);
						} else {
							res.status(404).end();
						}
					}, failHandler(res));
			}
		};
	};

	RestHelper.prototype.find = function(postFilter){
		let instance = this;
		return function(req, res){
			instance
				.databasehandler
				.membersOfSet(instance.entity, 'PostTypeId1')
				.then(function(data){
					if (data){
						Q.all(data.slice(-SIZE).map(function(o){
								return instance
									.databasehandler
									.findByKey(instance.entity, o);
							}))
							.then(function(docs){
								if (postFilter){
									docs = docs.filter(postFilter);
								}
								res.json(docs);
							})
					} else {
						res.status(404).end();
					}
				}, failHandler(res));
		};
	};

	RestHelper.prototype.flush = function(){
		let instance = this;
		return function(req, res){
			instance
				.databasehandler
				.flush()
				.then(function(){
					res.json({});
				}, failHandler(res));
		};
	};

	module.exports = RestHelper;

})(module, console);
