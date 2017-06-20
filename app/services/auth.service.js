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