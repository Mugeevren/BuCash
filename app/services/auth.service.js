app.service('Auth', ['localStorageService','http','$q',function (localStorageService,http,$q) {
	
	this.Login = function(obj){
		var defer = $q.defer();
		localStorageService.set('isLogin',1);
		defer.resolve(this.isLogin());
		return defer.promise;
	};

	this.Logout = function(){

		localStorageService.set('isLogin',0)
	};

	this.getUser = function(){
		var defer = $q.defer();
		http.get('GetUser').then(function(e){
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

}])