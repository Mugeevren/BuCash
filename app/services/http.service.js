app.service('http', ['$http','$q',function ($http,$q) {
	
	var hostURL ='/';
	var isSimulation = true;

	var urlGenerate = function(txnname,data){
		if(isSimulation){
			if(!_.isUndefined(data) && !_.isUndefined(data.id)){
				return '/data/'+txnname+'/'+data.id+'.json';
			}
			if(txnname=="LoginUser" || txnname=="LoginPoint"){
				return '/data/'+txnname+'/'+data.userName+data.password+'.json';
			}
			return '/data/'+txnname+'.json';
		}else{
			return hostURL+txnname;
		}
	}

	this.post = function(txnname,data){
		var defer = $q.defer();
		var url = urlGenerate(txnname);
		$http.post(url,data).then(function(e){

			 defer.resolve(e);

		},function(){
			defer.reject('Oops... something went wrong');
		});

		return defer.promise;
	}

	this.get = function(txnname,data){
		var defer = $q.defer();
		var url = urlGenerate(txnname,data);
		$http.get(url).then(function(e){
			
			 defer.resolve(e);

		},function(){
			defer.reject('Oops... something went wrong');
		});

		return defer.promise;
	}

	/*this.get = function(txnname){
		var defer = $q.defer();
		var url = urlGenerate(txnname);
		$http.get(url).then(function(e){
			
			 defer.resolve(e);

		},function(){
			defer.reject('Oops... something went wrong');
		});

		return defer.promise;
	}*/

}])





