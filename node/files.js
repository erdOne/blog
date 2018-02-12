// do not change
// logging to both console and log.txt

var fs = require("fs");
function log(msg){
    fs.appendFile('logs.txt', msg+'\n', (err) => {
        if (err) console.log(err);
        console.log(msg);
    });
}
exports.log = log;