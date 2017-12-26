

app.service('http', ['$http','$q',function ($http, $q) {
	
	var hostURL ='http://localhost:3000/';
	var isSimulation = true;
	var postConfig = [];
	
	if(isSimulation) {
		postConfig.push({
			PostName: "UpdatePointInfo",
			FileName: "GetPointInfo"
		});
	}

	var overwriteJSONFile = function (txnname, txndata){

		var fileToUpdate = postConfig.filter(function(item) { return item.PostName === txnname});
		if(!_.isUndefined(fileToUpdate) && fileToUpdate.length > 0) {
			fileToUpdate = fileToUpdate[0].FileName;
			var fileUrl = urlGenerate(fileToUpdate, txndata);
		}
		
		var fs = require('fs');

		fs.readFile(fileUrl, 'utf-8', function(err, data) {
			if (err) throw err;
			var arrayOfObjects = JSON.parse(data);
			//arrayOfObjects = data;
			/*arrayOfObjects.users.push({
				name: "Mikhail",
				age: 24
			});*/
			console.log(arrayOfObjects);
			fs.writeFile(fileUrl, JSON.stringify(arrayOfObjects), 'utf-8', function(err) {
				if (err) throw err;
				console.log('Done!');
			});
		});
	};

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
	};



	this.post = function(txnname,data){
		var defer = $q.defer();
		
		console.log(data);
		if(isSimulation) {
			overwriteJSONFile(txnname,data);
			defer.resolve(true);
		}
		else {
			var url = urlGenerate(txnname);
			$http.post(url,data).then(function(e){
			 	defer.resolve(e);
			},function(e){
				defer.reject('Oops... something went wrong');
			});

		}
		
		return defer.promise;
	}

	this.get = function(txnname,data){
		var defer = $q.defer();
		var url = urlGenerate(txnname,data);
		var config = {
			 params: data,
			 headers : {'Accept' : 'application/json'}
		};
		$http.get(url, config).then(function(e){
			
			 defer.resolve(e);

		},function(e){
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





