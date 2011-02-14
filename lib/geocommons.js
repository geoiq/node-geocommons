var qs = require('querystring'),
  http = require('http');
  
exports.dataset = function(ds_id, user, pass, callback){
  path = '/overlays/'+ds_id+'/features.json?geojson=1'
  if (user && pass){
    var auth = 'Basic ' + new Buffer(user + ':' + pass).toString('base64');
    makeRequest(path, auth, callback)
  } else {
    makeRequest(path, callback)
  }
}
  
exports.map = function(map_id,user,pass, callback){
  var path = '/maps/'+map_id+'.json'
  if (user && pass) { 
    var auth = 'Basic ' + new Buffer(user + ':' + pass).toString('base64');
    makeRequest(path, auth, callback)
  } else {
    makeRequest(path, callback)
  }
}
  
var makeRequest = function(path, auth, callback){
  var headers = {'host': 'geocommons.com'}
  if (auth) headers['Authorization'] = auth
  
  var client = http.createClient(80, 'geocommons.com');
  var request = client.request('GET', path , headers);
  
  var data = '';
  request.on('response', function (response) {
    response.on('data', function (chunk) {
      data += chunk;
    });
    response.on('end', function () {
      if(response.statusCode == 200){
        callback(null, JSON.parse(data));
      }else{
        callback(new Error('Response Status code: ' + response.statusCode), JSON.parse(data));
      }
    });
    response.on('error', function (error) {
      callback(error , data);
    });
  });
  request.end();
