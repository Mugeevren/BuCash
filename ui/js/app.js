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
app.controller('DashboardController', ['$scope', function ($scope) {
	
}])
app.controller('HomeDashboardController', ['$scope', function ($scope) {
	
}])
app.controller('PointDashboardController', ['$scope','$rootScope',"http", function ($scope, $rootScope,http) {

	$scope.Name = $rootScope.loggedInUser;
	$scope.Id = $rootScope.loggedInUserId;

	$scope.GetPointInfo = function(pointId){

		var req = {
			id: pointId ? pointId : $scope.Id
		};

		http.get("GetPointInfo",req).then(function(res){
			$scope.point = res.data.point;
			$rootScope.loggedInUser = res.data.point.name;
		});
	};
	
	$rootScope.onPointUpdateModalOpen = function(){
		$scope.updatePointInfoModalShown = true;
	};

	$rootScope.onCreateTransferModalOpen = function(){
		$scope.transferCreateModalShown = true;
	};

	$rootScope.onTransmissionModalOpen = function(){
		$scope.transmissionModalShown = true;
	};

	$rootScope.onRefundModalOpen = function(){
		$scope.refundModalShown = true;
	};

	$scope.GetPointInfo($scope.Id);

}])
app.controller('UserDashboardController', ['$scope','$rootScope','http', function ($scope, $rootScope, http) {
	$scope.Name = $rootScope.loggedInUser;
	$scope.Id = $rootScope.loggedInUserId;

	$scope.GetUserInfo = function(userId){

		var req = {
			id: userId
		};

		http.get("GetUserInfo",req).then(function(res){
			$scope.user = res.data;
			$rootScope.loggedInUser = res.data.name;
		});
	};
	
	

	$scope.GetUserInfo($scope.Id);

}])
app.service('Auth', ['localStorageService','http','$q',function (localStorageService,http,$q) {
	
	localStorageService.set('isLogin',0);

	this.Login = function(){
		var defer = $q.defer();
		localStorageService.set('isLogin',1);
		defer.resolve(this.isLogin());
		return defer.promise;
	};

	this.Logout = function(){

		localStorageService.set('isLogin',0);
		localStorageService.set('UserState',null);
	};

	this.getUser = function(userId){
		var defer = $q.defer();
		var req = { id: userId };
		http.get('GetUser',req).then(function(e){
 			defer.resolve(e);
		});
		return defer.promise;
	}

	this.isLogin = function(){
		var isLogin = localStorageService.get('isLogin');
		if(isLogin == 1){
			return true;
		}else{
			return false;
		}
	}

	this.SetState = function(state){
		localStorageService.set('UserState',state);
	};

	this.GetState = function(){
		return localStorageService.get('UserState');
	};

}])


app.service('http', ['$http','$q',function ($http, $q) {
	
	var hostURL ='http://localhost:3000/';
	var isSimulation = true;
	var postConfig = [];
	
	if(isSimulation) {
		postConfig.push({
			PostName: "UpdatePointInfo",
			FileName: "GetPointInfo"
		});
	}

	var overwriteJSONFile = function (txnname, txndata){

		var fileToUpdate = postConfig.filter(function(item) { return item.PostName === txnname});
		if(!_.isUndefined(fileToUpdate) && fileToUpdate.length > 0) {
			fileToUpdate = fileToUpdate[0].FileName;
			var fileUrl = urlGenerate(fileToUpdate, txndata);
		}
		
		var fs = require('fs');

		fs.readFile(fileUrl, 'utf-8', function(err, data) {
			if (err) throw err;
			var arrayOfObjects = JSON.parse(data);
			//arrayOfObjects = data;
			/*arrayOfObjects.users.push({
				name: "Mikhail",
				age: 24
			});*/
			console.log(arrayOfObjects);
			fs.writeFile(fileUrl, JSON.stringify(arrayOfObjects), 'utf-8', function(err) {
				if (err) throw err;
				console.log('Done!');
			});
		});
	};

	var urlGenerate = function(txnname,data){
		if(isSimulation){
			if(!_.isUndefined(data) && !_.isUndefined(data.id)){
				return '/data/'+txnname+'/'+data.id+'.json';
			}
			if(txnname=="LoginUser" || txnname=="LoginPoint"){
				return '/data/'+txnname+'/'+data.userName+data.password+'.json';
			}
			return '/data/'+txnname+'.json';
		}else{
			return hostURL+txnname;
		}
	};



	this.post = function(txnname,data){
		var defer = $q.defer();
		
		console.log(data);
		if(isSimulation) {
			overwriteJSONFile(txnname,data);
			defer.resolve(true);
		}
		else {
			var url = urlGenerate(txnname);
			$http.post(url,data).then(function(e){
			 	defer.resolve(e);
			},function(e){
				defer.reject('Oops... something went wrong');
			});

		}
		
		return defer.promise;
	}

	this.get = function(txnname,data){
		var defer = $q.defer();
		var url = urlGenerate(txnname,data);
		var config = {
			 params: data,
			 headers : {'Accept' : 'application/json'}
		};
		$http.get(url, config).then(function(e){
			
			 defer.resolve(e);

		},function(e){
			defer.reject('Oops... something went wrong');
		});

		return defer.promise;
	}


	/*this.get = function(txnname){
		var defer = $q.defer();
		var url = urlGenerate(txnname);
		$http.get(url).then(function(e){
			
			 defer.resolve(e);

		},function(){
			defer.reject('Oops... something went wrong');
		});

		return defer.promise;
	}*/

}])






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
						userName: $scope.user.name,
						password: $scope.user.password
					};

					http.get("LoginUser",req).then(function(res){
						if(res.data.UserId){
							Auth.Login().then(function(e){
								$rootScope.isLoggedIn = e;
							});
							$rootScope.loggedInUserId = res.data.UserId;
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
						userName: $scope.user.name,
						password: $scope.user.password
					};


					http.get("LoginPoint",req).then(function(res){
						if(res.data.UserId){
							
							Auth.Login().then(function(e){
								$rootScope.isLoggedIn = e;
							});
							$rootScope.loggedInUserId = res.data.UserId;
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
app.directive('modalDialog', function() {
  return {
    restrict: 'E',
    scope: {
      show: '=showModal',
      onCloseModal: '=?onCloseModal'
    },
    transclude: true, // Insert custom content inside the directive
    controller:['$scope', function ($scope) {
		  $scope.hideModal = function() {
        	$scope.show = false;
          if(_.isFunction($scope.onCloseModal)){
            $scope.onCloseModal();
          }
      };
      
	}],
    link: function(scope, element, attrs) {
      	console.log('attrs: ' , attrs);
      	scope.dialogStyle = {};
      	if (attrs.boxWidth) {
        	scope.dialogStyle.width = attrs.boxWidth;
      	}
      	if (attrs.boxHeight) {
        	scope.dialogStyle.height = attrs.boxHeight;
      	}
      	scope.hideModal = function() {
        	scope.show = false;
          if(_.isFunction(scope.onCloseModal)){
            scope.onCloseModal();
          }
      	};
    },
    templateUrl: 'app/directives/modaldialog.html'
  };
});
app.directive('pointinfoUpdateModal', [function () {
	return {
		restrict: 'E',
		templateUrl:'app/directives/pointinfoupdatemodal.html',
		replace: false,

		scope:{
			show: '=showModal',
			pointId: '=pointId',
			onModalClosed: '=?onModalClosed'
		},
		controller:['$scope','$rootScope','$state','http', function ($scope, $rootScope,$state,http) {
			
			http.get('GetPointInfo',{id: $scope.pointId}).then(function(res){
				$scope.point = res.data.point;
			});

			$scope.onWorkingHoursDivOpen = function() {
				$scope.workingHoursDivOpen = !$scope.workingHoursDivOpen;
				$scope.addresInfoDivOpen = false;
				$scope.pointInfoDivOpen = false;
			};
			$scope.onAddressInfoDivOpen = function() {
				$scope.addresInfoDivOpen = !$scope.addresInfoDivOpen;
				$scope.workingHoursDivOpen = false;
				$scope.pointInfoDivOpen = false;
			};
			$scope.onPointInfoDivOpen = function() {
				$scope.pointInfoDivOpen = !$scope.pointInfoDivOpen;
				$scope.workingHoursDivOpen = false;
				$scope.addresInfoDivOpen = false;
			};


			/*$scope.onAddressInfoUpdate = function(){
				var req = {
					id: $scope.pointId,
					address: $scope.point.address
				};
				http.post('UpdatePointAddress',req).then(function(res){
					if(res.data){

					}
				});
			};*/

			/*$scope.onWorkingHoursUpdate = function(){
				var req = {
					id: $scope.pointId,
					workingHours: $scope.point.workingHours
				};
				http.post('UpdatePointWorkingHours',req).then(function(res){
				});
			};*/

			$scope.onPointInfoUpdate = function(){
				var req = {
					id: $scope.pointId,
					point: {
						name: $scope.point.name,
						image: $scope.point.image,
					}
				};
				http.post('UpdatePointInfo',req).then(function(res){
				});
			};

			$scope.onPointInfoDivOpen();
		
		}],
		link:function (scope, element, attrs){

        }
	};
}])
app.directive('refundModal', [function () {
	return {
		restrict: 'E',
		templateUrl:'app/directives/refundmodal.html',
		replace: false,

		scope:{
			show: '=showModal'
		},
		controller:['$scope','$rootScope','$state', function ($scope, $rootScope,$state) {
			

		
		}],
		link:function (scope, element, attrs){

        }
	};
}])
app.directive('transferCreateModal', [function () {
	return {
		restrict: 'E',
		templateUrl:'app/directives/transfercreatemodal.html',
		replace: false,

		scope:{
			show: '=showModal',
			title: '@title',
			onModalClosed: '=?onModalClosed'
		},
		controller:['$scope','$rootScope','$state','http', function ($scope, $rootScope,$state,http) {
			
			$scope.$watch('show',function(newVal,oldVal){
				if(newVal != oldVal && !newVal){
					$scope.transfer = {};
					$scope.input = {};
					$scope.clearDisplayContainers();
					$scope.isSenderContainerVisible = true;
					$scope.isTransferConfimed = false;
					$scope.isSenderSearchSuccess = false;
					$scope.isReceiverSearchSuccess = false;
				}
			});

			$scope.transfer = {};
			$scope.input = {};
			$scope.isSenderContainerVisible = true;

			$scope.clearDisplayContainers = function(){
				$scope.isSenderContainerVisible = false;
				$scope.isReceiverContainerVisible = false;
				$scope.isTransferInfoContainerVisible = false;
				$scope.isConfirmationContainerVisible = false;
				$scope.isTransferSummaryContainerVisible = false;
			};
			$scope.showSenderContainer = function(){
				if(!$scope.isTransferConfimed){
					$scope.clearDisplayContainers();
					$scope.isSenderContainerVisible = true;
				}
			};
			$scope.showReceiverContainer = function(){
				if(!$scope.isTransferConfimed && $scope.isSenderSearchSuccess){
					$scope.clearDisplayContainers();
					$scope.isReceiverContainerVisible = true;
				}
			};
			$scope.showTransferInfoContainer = function(){
				if(!$scope.isTransferConfimed && $scope.isReceiverSearchSuccess){
					$scope.clearDisplayContainers();
					$scope.isTransferInfoContainerVisible = true;
				}
			};
			$scope.showConfirmationContainer = function(){
				if(!$scope.isTransferConfimed && $scope.transfer.amount != undefined && $scope.transfer.amount.length>0){
					$scope.clearDisplayContainers();
					$scope.isConfirmationContainerVisible = true;
				}
			};
			$scope.showTransferSummaryContainer = function(){
				if($scope.isTransferConfimed){
					$scope.clearDisplayContainers();
					$scope.isTransferSummaryContainerVisible = true;
				}
			};

			$scope.onSearchSenderClick = function(){
				var req = {
					searchQuery: $scope.input.searchSenderQuery
				};
				http.post("GetUsersByPhoneOrIdentificationNumber",req).then(function(res){
					if(res.data.user){
						$scope.transfer.sender = res.data.user;
						$scope.isSenderSearchSuccess = true;
					}
					else{
						$scope.noSenderUserMessage = res.data.message;
						$scope.isSenderSearchSuccess = false;
					}
					$scope.input.searchSenderQuery = undefined;
				});
			};

			$scope.onSearchReceiverClick = function(){
				var req = {
					searchQuery: $scope.input.searchReceiverQuery
				};
				http.post("GetUsersByPhoneOrIdentificationNumber",req).then(function(res){
					if(res.data.user){
						$scope.transfer.receiver = res.data.user;
						$scope.isReceiverSearchSuccess = true;
					}
					else{
						$scope.noReceiverUserMessage = res.data.message;
						$scope.isReceiverSearchSuccess = false;
					}
					$scope.input.searchReceiverQuery = undefined;
				});
			};
			
			$scope.onConfirmTransferClick = function(){
				$scope.transfer.receiverPoint = {
					name: $rootScope.loggedInUser,
					id: $rootScope.loggedInUserId
				};
				$scope.transfer.receivingDate = moment().format('dd/MM/YYYY');
				var req = {
					transfer: $scope.transfer
				};
				http.post("AddNewTransfer",req).then(function(res){
					if(res.data.message){
						$scope.isTransferConfimed = true;
						$scope.showTransferSummaryContainer();
					}
					else{

					}
				});
			};
		
		}],
		link:function (scope, element, attrs){

        }
	};
}])
app.directive('transferList', [function () {
	return {
		restrict: 'E',
		templateUrl:'app/directives/transferlist.html',
		replace: false,

		scope:{
			list:'=?list'
		},
		controller:['$scope','$rootScope','$state', function ($scope, $rootScope,$state) {
			
			$scope.$watch('$scope.list',function(){
				if ($scope.list) {}
			});
		
		}],
		link:function (scope, element, attrs){

        }
	};
}])
app.directive('transmissionRefundModal', [function () {
	return {
		restrict: 'E',
		templateUrl:'app/directives/transmissionmodal.html',
		replace: false,

		scope:{
			show: '=showModal'
		},
		controller:['$scope','$rootScope','$state','http', function ($scope, $rootScope,$state,http) {
			

			$scope.onSearchTransmissionCodeClick = function (){
				var req = {
					transmissionCode: $scope.input.searchTransmissionCode
				};
				http.post("GetTransferByTransmissionCode",req).then(function(res){
					if(res.data.transfer){
						$scope.transfer = res.data.transfer;
						$scope.isTransferCodeSearchSuccess = true;
					}
					else{
						$scope.isTransferCodeSearchSuccess = false;
					}
					$scope.input.searchTransmissionCode = undefined;
				});
			};

			$scope.onSearchReceiverClick = function (){
				if($scope.transfer.receiver.identificationNumber == $scope.input.searchReceiverQuery || $scope.transfer.receiver.mobilephone == $scope.input.searchReceiverQuery ){
					$scope.isReceiverSearchSuccess = true;
				}
				else {
					$scope.isReceiverSearchSuccess = false;
				}
				
			};

			$scope.MarkTransmissionAsComplete = function(){
				var req = {
					transfer: $scope.transfer
				};
				http.post("MarkTransmissionAsComplete",req).then(function(res){
					if(res.data.transferCompleted){
						$scope.isTransmissionCompleted = true;
					}
					else{
						$scope.isTransmissionCompleted = false;
					}
				});
			};

			$scope.onSearchReceiverConfirmationCodeClick = function(){
				var req = {
					confirmationCode: $scope.input.searchReceiverConfirmationCode,
					receiverId: $scope.transfer.receiver.id
				};
				http.post("CheckReceiverConfirmationCode",req).then(function(res){
					if(res.data.isCodeConfirmed){
						$scope.isReceiverConfirmationCodeSearchSuccess = true;
					}
					else{
						$scope.isReceiverConfirmationCodeSearchSuccess = false;
					}
					$scope.input.searchReceiverConfirmationCode = undefined;
				});
			};

			$scope.$watch('show',function(newVal,oldVal){
				if(newVal != oldVal && !newVal){
					$scope.transfer = {};
					$scope.input = {};
					$scope.clearDisplayContainers();
					$scope.isTransmissionCodeContainerVisible = true;
					$scope.isTransferConfimed = false;
					$scope.isSenderSearchSuccess = false;
					$scope.isReceiverSearchSuccess = false;
				}
			});

			$scope.transfer = {};
			$scope.input = {};
			$scope.isTransmissionCodeContainerVisible = true;

			$scope.clearDisplayContainers = function(){
				$scope.isTransmissionCodeContainerVisible = false;
				$scope.isReceiverContainerVisible = false;
				$scope.isReceiverConfirmationContainerVisible = false;
				$scope.isConfirmationContainerVisible = false;
				$scope.isTransmissionInfoContainerVisible = false;
			};
			$scope.showTransmissionCodeContainer = function(){
				$scope.isTransmissionCodeContainerVisible = true;
			};
			$scope.showReceiverContainer = function(){
				$scope.isTransmissionCodeContainerVisible = false;
				$scope.isReceiverContainerVisible = true;
			};
			$scope.showReceiverConfirmationContainer = function(){
				$scope.sendReceiverConfirmationCode();
				$scope.isReceiverContainerVisible = false;
				$scope.isReceiverConfirmationContainerVisible = true;
				
			};
			$scope.showTransmissionConfirmationContainer = function(){
				$scope.isReceiverConfirmationContainerVisible = false;
				$scope.isConfirmationContainerVisible = true;
				
			};

			$scope.onConfirmTransmissionClick = function(){
				$scope.MarkTransmissionAsComplete();
				$scope.isConfirmationContainerVisible = false;
				$scope.isTransmissionInfoContainerVisible = true;
			};
		
		}],
		link:function (scope, element, attrs){

        }
	};
}])