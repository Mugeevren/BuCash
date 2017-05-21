app.controller('UserDashboardController', ['$scope','$rootScope', function ($scope, $rootScope) {
	$scope.Name = $rootScope.loggedInUser.Name;
}])