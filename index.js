var server = require("./node/server.js");
var router = require("./node/router.js");
var F = require("./node/files.js");
F.log("");
F.log("Server starting at path :"+ __dirname);
server.connCreate(router.route,__dirname);