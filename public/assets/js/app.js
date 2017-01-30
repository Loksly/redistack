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
					.when('/:page', {templateUrl: '/assets/partials/list.html', controller: 'ListCtrl' })
					.when('/questions/tagged/:tag', {templateUrl: '/assets/partials/list.html', controller: 'ListCtrl' })
					.when('/questions/tagged/:tag/:page', {templateUrl: '/assets/partials/list.html', controller: 'ListCtrl' })
					.when('/questions/:id', {templateUrl: '/assets/partials/question.html', controller: 'QuestionCtrl' })

					.otherwise({redirectTo: '/' });
				$locationProvider.html5Mode(true);
			}
		])
		.factory('Post', ['$resource', function($resource){
			return $resource('/api/v1/posts/:id', {}, {query: {method: 'GET', isArray: true }});
		}])
		.factory('Tag', ['$resource', function($resource){
			return $resource('/api/v1/tags/:id', {}, {query: {method: 'GET', isArray: true }});
		}])
		.factory('User', ['$resource', function($resource){
			return $resource('/api/v1/users/:id', {}, {query: {method: 'GET', isArray: true }});
		}])
		.controller('ListCtrl',
			['Post', 'Tag', '$routeParams', '$scope', 
			function(Post, Tag, $routeParams, $scope){
				var instance = $scope;
				instance.tag = false;
				instance.readOnly = true;
				instance.selectedtag = typeof $routeParams.tag !== 'undefined' ? $routeParams.tag : false;
				instance.page = typeof $routeParams.page !== 'undefined' ? parseInt($routeParams.page) : 1;
				instance.prefix = instance.selectedtag ? '/questions/tagged/' + instance.selectedtag : '/';
				instance.previousPageLink = instance.page === 1 ? false : (instance.prefix + '/' + (instance.page - 1) );
				instance.nextPageLink = (instance.prefix + '/' + (instance.page + 1) );
				if (instance.selectedtag){
					Tag.query({ TagName: instance.selectedtag }, function(data){
						if (data.length > 0){
							instance.tag = data[0];
						}
					});
					instance.questions = Post.query({Tags: instance.selectedtag, page: instance.page}, function(){ buildTags(instance.questions);	});
				} else {
					instance.questions = Post.query({'PostTypeId': 1, page: instance.page}, function(){ buildTags(instance.questions);	});
				}
			}
		])
		.controller('QuestionCtrl',
			['Post', 'User', '$routeParams', '$scope', '$sce',
			function(Post, User, $routeParams, $scope, $sce){
				var instance = $scope;
				instance.question = Post.get({ id: $routeParams.id }, function(){
					instance.question.Body = $sce.trustAsHtml(instance.question.Body);
					instance.question.user = User.get({id: instance.question.OwnerUserId});
				});
				instance.answers = Post.query({'ParentId': $routeParams.id}, function(){
					for(var i = 0, j = instance.answers.length; i < j; i++){
						instance.answers[i].user = User.get({id: instance.answers[i].OwnerUserId});
					}
				});
			}
		]);
		

})(angular);