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