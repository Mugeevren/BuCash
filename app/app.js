var app = angular.module('BuCash', 
	[
		'ui.router',
		'ngSanitize',
		'ui.select',
        "LocalStorageModule"
	]);

app.config(function($stateProvider, $urlRouterProvider,localStorageServiceProvider) {
     localStorageServiceProvider.setPrefix('BuCash');

    $urlRouterProvider.otherwise('/homedashboard');
    
    $stateProvider
        .state('homedashboard', {
            url: '/homedashboard',
            templateUrl: 'app/views/homedashboard.html',
            controller:'HomeDashboardController'
        });

    $stateProvider
        .state('userdashboard', {
            url: '/userdashboard',
            templateUrl: 'app/views/userdashboard.html',
            controller:'UserDashboardController',
            data: { auth: "user"}
        });
    $stateProvider
        .state('pointdashboard', {
            url: '/pointdashboard',
            templateUrl: 'app/views/pointdashboard.html',
            controller:'PointDashboardController',
            data: { auth: "point"}
        });
        
      
        
});

app.controller('MainController', ['$scope','$rootScope','Auth','$state', function ($scope,$rootScope,Auth,$state) {
	
	
	$scope.modalShown = false;
  	$scope.openUserLoginModal = function() {
    	$scope.modalShown = true;
    	$scope.isUserLoginOpened = true;
    	$scope.isBucashPointLoginOpened = false;
  	};

  	$scope.openPointLoginModal = function() {
    	$scope.modalShown = true;
    	$scope.isBucashPointLoginOpened = true;
    	$scope.isUserLoginOpened = false;
  	};

    $scope.LogOut = function(){
        Auth.Logout();
        Auth.SetState(null);
        $rootScope.loggedInUser = undefined;
        $rootScope.loggedInUserId = undefined;
        $rootScope.isLoggedIn = false;
        $state.go("homedashboard");
    };


    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
        if (!Auth.isLogin() && !_.isUndefined(toState.data) && !_.isUndefined(toState.data.auth) && (toState.data.auth === 'user' || toState.data.auth === 'point')) {
            event.preventDefault();
            return false;
        }
        else if (!_.isUndefined(toState.data) && !_.isUndefined(toState.data.auth) && toState.data.auth === 'user' && Auth.GetState() != "user" ) {
            event.preventDefault();
            return false;
        }
        else if (!_.isUndefined(toState.data) && !_.isUndefined(toState.data.auth) && toState.data.auth === 'point' && Auth.GetState() != "point" ) {
            event.preventDefault();
            return false;
        }
    });

    
}]);