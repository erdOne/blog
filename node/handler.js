// do not change
// handling url request

var LockedAddr = ["/index.js"];
var LockedAddrs = ["node",".txt"];

var Handler = function(response){
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.write('You found and easter egg\n');
    response.end();
}
var LockedHandler = function(response){
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.write('Welcome to the world of Node.js\n');
    response.end();
}

var addr = {
    "/easter" : Handler,
    "/" : "/index.html"
};

for(a in LockedAddr){
    addr[LockedAddr[a]] = LockedHandler;
}

function Handle(response,paths){
    var retObj = {};
    retObj.path = paths;
    if(typeof addr[paths] == "function"){
            addr[paths](response);
            retObj.handleable = false;
            return retObj;
    }
    if(typeof addr[paths] == "string"){
        paths = addr[paths];
    }
    
    if(paths.indexOf(".") == -1){
        paths += ".html";
    }
    retObj.path = paths;
    var b = false;
    for(a in LockedAddrs)if(paths.indexOf(LockedAddr[a]) !== -1)b = true;
    if(b){
        response.writeHead(403, {'Content-Type': 'text/plain'});
        response.write("You do not have the permission to visit this document.");
        response.end();
        retObj.handleable = false;
    }
    retObj.handleable = true;
    return retObj;
}

exports.Handle = Handle;