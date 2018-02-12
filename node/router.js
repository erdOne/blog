//do not change
//reading files

var fs = require('fs');
var F = require("./files.js");
var handler = require("./handler.js");

exports.route = function(path,response,dir){
    F.log("Routing path: " + path);
    var handleResult = handler.Handle(response,path);
    if(handleResult.handleable){
        path = handleResult.path;
        var Fdir = dir + path;
        F.log("Reading file with path "+ Fdir);
        fs.readFile(Fdir,function(error,data){
            if(error){
                response.writeHead(404);
                response.write("Oops this page doesn't exist - 404");
            }else{
                response.writeHead(200, {"Content-Type": "text/html"});
                response.write(data, "utf8");
            }
            response.end();
        });
    }
}