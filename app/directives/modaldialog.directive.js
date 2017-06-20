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