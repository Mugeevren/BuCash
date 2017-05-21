app.directive('modalDialog', function() {
  return {
    restrict: 'E',
    scope: {
      show: '=showModal'
    },
    transclude: true, // Insert custom content inside the directive
    controller:['$scope', function ($scope) {
		  $scope.hideModal = function() {
        	scope.show = false;
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
      	};
    },
    templateUrl: 'app/directives/modaldialog.html'
  };
});