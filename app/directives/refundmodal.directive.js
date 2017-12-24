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