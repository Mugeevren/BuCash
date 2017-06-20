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