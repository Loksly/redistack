(function(angular){
	'use strict';


	angular
		.module('StackApp', ['ngMaterial', 'ngAnimate', 'ngResource'])
		.factory('Question', ['$resource', function($resource){
			return $resource('/assets/data/20.json');
		}])
		.controller('AppController', ['Question', function(Question){
			this.selectedlabel = 'Ejemplo';
			this.questions = Question.query();
		}])
		.controller('AppCtrl', function($scope) {

			
		})
})(angular);