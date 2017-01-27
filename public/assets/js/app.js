(function(angular){
	'use strict';


	angular
		.module('StackApp', ['ngMaterial', 'ngAnimate', 'ngResource'])
		.factory('Question', ['$resource', function($resource){
			return $resource('/api/v1/questions/:id', {}, {query: {method: 'GET', isArray: true }});
		}])
		.controller('AppController', ['Question', function(Question){
			var instance = this;
			instance.readOnly = true;
			instance.selectedlabel = 'Ejemplo';
			instance.questions = Question.query(function(){
				for(var i = 0, j = instance.questions.length; i < j; i++){

					instance.questions[i].TagsA = instance
						.questions[i]
						.Tags
						.split('><')
						.map(function(s){
							return s.replace('<', '').replace('>', '');
						});
				}
			});
		}])
		
})(angular);