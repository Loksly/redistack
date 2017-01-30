(function(){
	'use strict';
	const assert = require('assert');

	function Entity(config){
		assert(config, 'Config must be valid');
		assert(config.schema, 'Config schema must be valid');
		assert(config.entity, 'Config entity must be valid');
		let instance = this;
		this.config = config;
		this.attributes = Object.keys(this.config.schema);
		this.keys = this.attributes.filter(function(o){ return typeof instance.config.schema[o].key !== 'undefined' && instance.config.schema[o].key; });
		if (this.keys.length === 0){
			this.keys = [ this.attributes[0] ];
		}
	}

	Entity.prototype.getAttributes = function(){
		return this.attributes;
	};

	Entity.prototype.getKeyField = function(){
		return this.keys[0];
	};

	Entity.prototype.getPrefix = function(){
		return this.config.entity;
	};

	module.exports = Entity;

})(module);
