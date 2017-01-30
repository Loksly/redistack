(function(angular){
	'use strict';

	function buildTags(questions){
		for(var i = 0, j = questions.length; i < j; i++){
			questions[i].TagsA = questions[i]
				.Tags
				.split('><')
				.map(function(s){
					return s.replace('<', '').replace('>', '');
				});
		}
	}

	angular
		.module('StackApp', ['ngMaterial', 'ngAnimate', 'ngResource', 'ngRoute', 'ngSanitize'])
		.config(['$routeProvider', '$locationProvider',
			function($routeProvider, $locationProvider){
				$routeProvider
					.when('/', {templateUrl: '/assets/partials/list.html', controller: 'ListCtrl' })
					.when('/questions/tagged/:tag', {templateUrl: '/assets/partials/list.html', controller: 'ListCtrl' })
					.when('/questions/:id', {templateUrl: '/assets/partials/question.html', controller: 'QuestionCtrl' })

					.otherwise({redirectTo: '/' });
				$locationProvider.html5Mode(true);
			}
		])
		.factory('Question', ['$resource', function($resource){
			return $resource('/api/v1/questions/:id', {}, {query: {method: 'GET', isArray: true }});
		}])
		.factory('Tag', ['$resource', function($resource){
			return $resource('/api/v1/tags/:id', {}, {query: {method: 'GET', isArray: true }});
		}])
		.factory('User', ['$resource', function($resource){
			return $resource('/api/v1/users/:id', {}, {query: {method: 'GET', isArray: true }});
		}])
		.controller('ListCtrl',
			['Question', 'Tag', '$routeParams', '$scope', 
			function(Question, Tag, $routeParams, $scope){
				var instance = $scope;
				instance.readOnly = true;
				instance.selectedtag = typeof $routeParams.tag !== 'undefined' ? $routeParams.tag : false;
				if (instance.selectedtag){
					instance.tag = Tag.get({ id: instance.selectedtag });
					instance.questions = Question.query({tag: instance.selectedtag}, function(){ buildTags(instance.questions);	});
				} else {
					instance.questions = Question.query(function(){ buildTags(instance.questions);	});
				}
				
			}
		])
		.controller('QuestionCtrl',
			['Question', 'User', '$routeParams', '$scope', '$sce',
			function(Question, User, $routeParams, $scope, $sce){
				var instance = $scope;
				instance.question = Question.get({ id: $routeParams.id }, function(){
					instance.question.Body = $sce.trustAsHtml(instance.question.Body);
					instance.user = User.get({id: instance.question.OwnerUserId});
				});
			}
		]);
		

})(angular);