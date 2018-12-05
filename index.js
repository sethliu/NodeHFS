var express = require('express');
var restapi = express(); 
var fs = require('fs');

function readFileList(path, filesList){ 
  var files = fs.readdirSync(path);
  files.forEach(function (itm, index) { 
  	var stat = fs.statSync(path + itm); 
  	if (stat.isDirectory()) { 
  	readFileList(path + itm + "/", filesList) } 
  	else { 
        var filename = itm;
  	    if (filename.substr(filename.length-4).toLowerCase() == '.mp4'){
        var obj = {};
  		obj.path = path;
    	obj.filename = itm;
    	obj.createtime = stat.ctime;
    	var sizeStr;
        if (stat.size < 1024){
           sizeStr = stat.size + 'B'
        }
        else if ((stat.size >= 1024) && (stat.size < 1024 * 1024)){
           sizeStr = Math.round(stat.size/1024) + 'KB'
        }
        else if ((stat.size >= 1024 * 1024) && (stat.size < 1024 * 1024 * 1024)){
            sizeStr = Math.round(stat.size/(1024*1024)) + 'MB'
        }
        else{
             sizeStr = Math.round(stat.size/(1024*1024*1024)) + 'GB'
        }
        obj.size = sizeStr;
    	filesList.push(obj); 
  		}
	} 
}) 
}

restapi.use(express.static('public'));
restapi.get('/listFiles', function(req, res){ 
  res.header("Access-Control-Allow-Origin","*"); 
  res.header("Access-Control-Allow-Headers", "X-Requested-With,Origin,Content-Type,Accept");  
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS"); 
  results = [];
  var path = "C:/Users/Administrator/Pictures/";
  readFileList(path, results);
  console.log(new Date().toLocaleString() + "	listFiles");
  res.json(results); 
});
restapi.listen(3002);
console.log("Submit GET to http://localhost:3002/listFiles");