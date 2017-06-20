var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
var cors = require('cors');

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'example.com');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    
}
app.use(cors());

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

var getData = function(name) {
                return JSON.parse(fs.readFileSync("./data/"+name+".json", 'utf8'));
};

app.get('/data/:simulation', function(req, res) {

                var data = getData(req.params.simulation);
                res.json({data:data});

});

app.get('/GetPointInfo', function(req, res) {

                var id = req.query.id;
                var data = getData("GetPointInfo");
                var result = data.users.filter(x => x.id == id);
                if(result.length > 0){
                        //data =  JSON.stringify({"id": result[0].id});
                        res.json({point: result[0].point});
                }
                else {
                        data =  JSON.parse('{"message": "Böyle bir kullanıcı bulunamadı!"}');
                        res.json(data);
                }

                /*
                ------ WRITE TO SIMULATION DATA -------
                var data = getData("GetPointInfo");
                data.name= req.query.name ? req.query.name :'name';
                data =  JSON.stringify(data);

                fs.writeFileSync("./data/GetPointInfo.json", data, 'utf8');
                res.json({data:data});*/

});

app.get('/GetUserInfo', function(req, res) {

                var id = req.query.id;
                var data = getData("GetUserInfo");
                var result = data.users.filter(x => x.id == id);
                if(result.length > 0){
                        //data =  JSON.stringify({"id": result[0].id});
                        res.json({user: result[0]});
                }
                else {
                        data =  JSON.parse('{"message": "Böyle bir kullanıcı bulunamadı!"}');
                        res.json(data);
                }
});

app.post('/LoginUser', function(req, res) {
		var username = req.body.username;
		var password = req.body.password;
                var data = getData("LoginUser");
                var result = data.users.filter(x => x.username == username && x.password == password);
                if(result.length > 0){
                	//data =  JSON.stringify({"id": result[0].id});
                	res.json(JSON.parse('{"id": "'+result[0].id+'"}'));
                }
                else {
                        data =  JSON.parse('{"message": "Kullanıcı adı veya şifre yanlış!"}');
                        res.json(data);
                }
                //res.json({data:data});

});

app.post('/LoginPoint', function(req, res) {

		var username = req.body.username;
		var password = req.body.password;
                var data = getData("LoginPoint");
                var result = data.users.filter(x => (x.username == username && x.password == password));
                if(result.length > 0){
                        //data =  JSON.stringify({"id": result[0].id});
                        res.json(JSON.parse('{"id": "'+result[0].id+'"}'));
                }
                else {
                        data =  JSON.parse('{"message": "Kullanıcı adı veya şifre yanlış!"}');
                        res.json(data);
                }
});

app.get('/GetCities', function(req, res) {

                var data = getData("GetCities");
                if(data){
                        //data =  JSON.stringify({"id": result[0].id});
                        res.json(data.cities);
                }
                else {
                        data =  JSON.parse('{"message": "Server hatası!"}');
                        res.json(data);
                }
});

app.get('/GetProvinces', function(req, res) {

                var id =  req.query.id;
                var data = getData("GetProvinces");
                var result = data.cities.filter(x => x.id == id);
                if(result.length > 0){
                        //data =  JSON.stringify({"id": result[0].id});
                        res.json({provinces:result[0].provinces});
                }
                else {
                        data =  JSON.parse('{"message": "Server hatası!"}');
                        res.json(data);
                }
});

app.post('/UpdatePointAddress', function(req, res) {

             
                var id = req.body.id;
                var address = req.body.address;
               
                var data = getData("GetPointInfo");
                var result = data.users.filter(x => x.id == id);
                
                if(result.length > 0){
                    result = result[0];

                    result.point.address = address;
                   
                    for(var i in data.users){
                        var item = data.users[i];
                       
                        if(item.id == result.id){
                               data.users[i]  = result;
                               break;
                        }
                    }
                    
                    data =  JSON.stringify(data);

                    fs.writeFileSync("./data/GetPointInfo.json", data, 'utf8');
                    res.json({data:JSON.parse('{"message": "Success!!"}')});
                }
                else {
                    res.json({data:JSON.parse('{"message": "Error!!"}')});
                }
                //res.json({data:data});

});

app.post('/LoginUser', function(req, res) {
        var username = req.body.username;
        var password = req.body.password;
                var data = getData("LoginUser");
                var result = data.users.filter(x => x.username == username && x.password == password);
                if(result.length > 0){
                    //data =  JSON.stringify({"id": result[0].id});
                    res.json(JSON.parse('{"id": "'+result[0].id+'"}'));
                }
                else {
                        data =  JSON.parse('{"message": "Kullanıcı adı veya şifre yanlış!"}');
                        res.json(data);
                }
                //res.json({data:data});

});

app.post('/UpdatePointAddress', function(req, res) {

             
                var id = req.body.id;
                var address = req.body.address;
               
                var data = getData("GetPointInfo");
                var result = data.users.filter(x => x.id == id);
                
                if(result.length > 0){
                    result = result[0];

                    result.point.address = address;
                   
                    for(var i in data.users){
                        var item = data.users[i];
                       
                        if(item.id == result.id){
                               data.users[i]  = result;
                               break;
                        }
                    }
                    
                    data =  JSON.stringify(data);

                    fs.writeFileSync("./data/GetPointInfo.json", data, 'utf8');
                    res.json({data:JSON.parse('{"message": "Success!!"}')});
                }
                else {
                    res.json({data:JSON.parse('{"message": "Error!!"}')});
                }
                //res.json({data:data});

});

app.post('/UpdatePointWorkingHours', function(req, res) {

             
                var id = req.body.id;
                var workingHours = req.body.workingHours;
               
                var data = getData("GetPointInfo");
                var result = data.users.filter(x => x.id == id);
                
                if(result.length > 0){
                    result = result[0];

                    result.point.workingHours = workingHours;
                   
                    for(var i in data.users){
                        var item = data.users[i];
                       
                        if(item.id == result.id){
                               data.users[i]  = result;
                               break;
                        }
                    }
                    
                    data =  JSON.stringify(data);

                    fs.writeFileSync("./data/GetPointInfo.json", data, 'utf8');
                    res.json({data:JSON.parse('{"message": "Success!!"}')});
                }
                else {
                    res.json({data:JSON.parse('{"message": "Error!!"}')});
                }
                //res.json({data:data});

});

app.post('/UpdatePointInfo', function(req, res) {

                console.log(req.body);
                var id = req.body.id;
                var name = req.body.point.name;
                var image = req.body.point.image;
               
                var data = getData("GetPointInfo");
                var result = data.users.filter(x => x.id == id);
                
                if(result.length > 0){
                    result = result[0];

                    result.point.name = name;
                    result.point.image = image;
                   
                    for(var i in data.users){
                        var item = data.users[i];
                       
                        if(item.id == result.id){
                               data.users[i]  = result;
                               break;
                        }
                    }
                    
                    data =  JSON.stringify(data);

                    fs.writeFileSync("./data/GetPointInfo.json", data, 'utf8');
                    res.json({data:JSON.parse('{"message": "Success!!"}')});
                }
                else {
                    res.json({data:JSON.parse('{"message": "Error!!"}')});
                }
                //res.json({data:data});

});

app.post('/AddNewTransfer',function(req,res){

                var transfer = req.body.transfer;
                var data = getData("GetTransfers");
                transfer.id = data.transfers.length + 1;
                data.transfers.push(transfer);
                data =  JSON.stringify(data);
                fs.writeFileSync("./data/GetTransfers.json", data, 'utf8');
                data = JSON.parse('{"message": "Success!!"}');
                res.json(data);
});

app.post('/GetUsersByPhoneOrIdentificationNumber',function(req,res){

                var searchQuery = req.body.searchQuery;
                var data = getData("GetUserInfo");
                var results = data.users.filter(x => x.mobilephone === searchQuery || x.identificationNumber === searchQuery);
                if(results.length > 0){
                    //data =  JSON.stringify({"id": result[0].id});
                    res.json({user : results[0]});
                }
                else {
                        data =  JSON.parse('{"message": "Aradığınız kriterlere uygun kullanıcı bulunmadı!"}');
                        res.json(data);
                }
});

app.listen(3000);
console.log('Server listining with 3000 port');
