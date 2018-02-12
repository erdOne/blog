// do not change
// starting servers

var http = require('http');
var url = require('url');
var qs = require('querystring');
var F = require("./files.js");
var WS = require('./WSCore.js');
var ajax = require("./ajax.js")
var port = 1270;

exports.connCreate = function(route,dir){
    async function connRequest(request, response){
        var path = url.parse(request.url,true).pathname;
        var queryObj = url.parse(request.url,true).query;
        F.log("Request for " + path + " received, with query "+JSON.stringify(queryObj)+'.');
        if(path == "/ajax"){
            var body = "";
            request.on("data",(chunk) =>{
                body+= chunk;
                F.log("Server has recieved data: "+chunk);
            });
            request.on("end",async ()=>{
                body = qs.parse(body);
                if(request.method == "POST")await ajax.processPost(response,body);
                response.end();
            });
        }else{
            route(path,response,dir);
        }
    }
    var Server = http.createServer(connRequest).listen(port,function(){
        var d = new Date();
        F.log("Server has started at "+d.toISOString()+" and is listening on port "+port+".");
    });
    WS.WSconnect(Server);
    
}