// do not change
// websocket core

var WS = require('./websocket.js')
var WebSocketServer = require('websocket').server;
var F = require("./files.js");
var conns = {};

function connect(Server){
    
    var WSServer = new WebSocketServer({
        httpServer : Server,
        autoAcceptConnections : false
    });
    
    function WSconnSend(message,connNo){
        message.connNo = connNo;
        if(conns[connNo] != undefined){
            conns[connNo].send(JSON.stringify(message));
            Flog("Message sent with status "+message.status);
        }
    }
    
    function WSconnMessage(message){
        WS.connMessage(message,WSconnSend);
    }
    
    function WSconnClose(reason, description){
        Flog('Websocket number '+no+' disconnected with reason: ' + reason);
        WS.connClose(reason,description,WSconnSend);
    }

    function WSconnRequest(request){
        var WSconn = request.accept(null, request.origin);
        WSconn.on("message",WSconnMessage);
        WSconn.on("close",WSconnClose);
        var no;
        do{
            no = Math.round(Math.random() * 8999 + 1000);
        }while(conns[no] != undefined)
        Flog("Websocket accepted with number "+no);
        WSconn.no = no;
        conns[no] = WSconn;
    }
    WSServer.on("request",WSconnRequest);
}
exports.WSconnect = connect;