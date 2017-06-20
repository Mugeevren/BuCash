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
		controller:['$scope','$rootScope','$state','Auth','http','$timeout', function ($scope, $rootScope,$state,Auth,http,$timeout) {
			
			$scope.user = {};

			$scope.dismiss = function(){
				$scope.user = {};
				$scope.show = false;
				$scope.loginErrorMessage = undefined;
				$scope.loginErrorVisible = false;
			};

			$scope.onLoginButtonClick = function() {
				$scope.loginErrorMessage = undefined;
				$scope.loginErrorVisible = false;
				if($scope.isUserLoginOpened) {
					console.log("müge login");
					
					var req  = {
						username: $scope.user.name,
						password: $scope.user.password
					};

					http.post("LoginUser",req).then(function(res){
						if(res.data.id){
							Auth.Login().then(function(e){
								$rootScope.isLoggedIn = e;
							});
							$rootScope.loggedInUserId = res.data.id;
							/*Auth.getUser(res.data.UserId).then(function(e){
								$rootScope.loggedInUser = e.data.name;
								$rootScope.loggedInUserId = e.data.id;
							});*/
							Auth.SetState("user");
							
							$scope.dismiss();
							$state.go("userdashboard");
						}
						else if(res.data.message){
							$scope.user = {};
							$scope.loginErrorMessage = res.data.message;
							$scope.loginErrorVisible = true;
						}
					});


					
				}
				else if($scope.isBucashPointLoginOpened) {
					console.log('sgdgafgadf');

					var req  = {
						username: $scope.user.name,
						password: $scope.user.password
					};


					http.post("LoginPoint",req).then(function(res){
						if(res.data.id){
							
							Auth.Login().then(function(e){
								$rootScope.isLoggedIn = e;
							});
							$rootScope.loggedInUserId = res.data.id;
							/*Auth.getUser(res.data.UserId).then(function(e){
								$rootScope.loggedInUser = e.data.name;
								$rootScope.loggedInUserId = e.data.id;
							});*/
							Auth.SetState("point");
							$scope.dismiss();
							$state.go("pointdashboard");
						}
						else if(res.data.message){
							$scope.user = {};
							$scope.loginErrorMessage = res.data.message;
							$scope.loginErrorVisible = true;
						}
					});
				}
			};
		
		}],
		link:function (scope, element, attrs){

        }
	};
}])