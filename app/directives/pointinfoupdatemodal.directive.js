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


			$scope.onAddressInfoUpdate = function(){
				var req = {
					id: $scope.pointId,
					address: $scope.point.address
				};
				http.post('UpdatePointAddress',req).then(function(res){
					if(res.data){

					}
				});
			};

			$scope.onWorkingHoursUpdate = function(){
				var req = {
					id: $scope.pointId,
					workingHours: $scope.point.workingHours
				};
				http.post('UpdatePointWorkingHours',req).then(function(res){
				});
			};

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

			
		
		}],
		link:function (scope, element, attrs){

        }
	};
}])