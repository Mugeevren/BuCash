app.directive('loginModal', [function () {
	return {
		restrict: 'E',
		templateUrl:'app/directives/loginmodal.html',
		replace: false,

		scope:{
			show: '=showModal',
            isUserLoginOpened: '=?isUserLoginOpened',
            isBucashPointLoginOpened: '=?isBucashPointLoginOpened'
            
		},
		controller:['$scope','$rootScope','$state','Auth','http', function ($scope, $rootScope,$state,Auth,http) {
			
			$scope.user = {};

			$scope.onLoginButtonClick = function() {
				if($scope.isUserLoginOpened) {
					console.log("müge login");
					
					var req  = {
						userName: $scope.user.name,
						password: $scope.user.password
					};

					var element = $scope.element;

					http.post("LoginUser",req).then(function(res){
						if(res.UserId){
							Auth.Login(obj).then(function(e){
								$rootScope.isLoggedIn = e;
							});
							Auth.getUser().then(function(e){
								$rootScope.loggedInUser = e.name;
								$rootScope.loggedInUserId = e.id;
							});
							$scope.show = false;
							$state.go("userdashboard");
						}
					});


					
				}
				else if($scope.isBucashPointLoginOpened) {
					console.log('sgdgafgadf');

					var req  = {
						userName: $scope.userName,
						password: $scope.password
					};

					http.post("LoginPoint",req).then(function(res){
						if(res.UserId){
							Auth.Login(obj).then(function(e){
								$rootScope.isLoggedIn = e;
							});
							Auth.getUser().then(function(e){
								$rootScope.loggedInUser = e.name;
								$rootScope.loggedInUserId = e.id;
							});
							$scope.show = false;
							$state.go("pointdashboard");
						}
					});
				}
			};
		
		}],
		link:function (scope, element, attrs){

        }
	};
}])