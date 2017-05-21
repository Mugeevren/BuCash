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
            controller:'UserDashboardController'
        });
    $stateProvider
        .state('pointdashboard', {
            url: '/pointdashboard',
            templateUrl: 'app/views/pointdashboard.html',
            controller:'PointDashboardController'
        });
        
      
        
});

app.controller('MainController', ['$scope','$rootScope','Auth','$state', function ($scope,$rootScope,Auth,$state) {
	
	$scope.Name = "Müge";
	$scope.isUserLoginOpened = false;
	$rootScope.isLoggedIn = false;
	$rootScope.loggedInUser = {
		Name:"Müge Evren"
	};

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

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    if (Auth.isLogin()) {
        event.preventDefault();
        $state.go('homedashboard');
    }
});
  	
}]);