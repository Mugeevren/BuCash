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