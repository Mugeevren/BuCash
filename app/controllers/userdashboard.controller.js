app.controller('UserDashboardController', ['$scope','$rootScope','http', function ($scope, $rootScope, http) {
	$scope.Name = $rootScope.loggedInUser;
	$scope.Id = $rootScope.loggedInUserId;

	$scope.GetUserInfo = function(userId){

		var req = {
			id: userId
		};

		http.get("GetUserInfo",req).then(function(res){
			$scope.user = res.data.user;
			$rootScope.loggedInUser = res.data.user.name;
		});
	};
	
	

	$scope.GetUserInfo($scope.Id);

}])