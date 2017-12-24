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