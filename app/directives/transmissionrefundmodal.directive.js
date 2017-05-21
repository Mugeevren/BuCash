app.directive('transmissionRefundModal', [function () {
	return {
		restrict: 'E',
		templateUrl:'app/directives/transmissionrefundmodal.html',
		replace: false,

		scope:{
			show: '=showModal',
			title: '@title',
			headerLevelOne: '@headerLevelOne',
			headerLevelTwo: '@headerLevelTwo',
			headerLevelThree: '@headerLevelThree'
		},
		controller:['$scope','$rootScope','$state', function ($scope, $rootScope,$state) {
			
			
			//$scope.workHoursList = [{value:"00:00"},{value:"01:00"},{value:"02:00"},{value:"03:00"},{value:"04:00"},{value:"05:00"},{value:"06:00"},{value:"07:00"},
			//{value:"08:00"},{value:"09:00"},{value:"10:00"},{value:"11:00"},{value:"12:00"},{value:"13:00"},{value:"14:00"},{value:"15:00"},
			//{value:"16:00"},{value:"17:00"},{value:"18:00"},{value:"19:00"},{value:"20:00"},{value:"21:00"},{value:"22:00"},{value:"23:00"},];

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

			/*$scope.calculateHeight = function(isExpand){
				if(isExpand){
					$scope.height += 150;
				}
				else{
					$scope.height -= 150;
				}
			};*/
		
		}],
		link:function (scope, element, attrs){

        }
	};
}])