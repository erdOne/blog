// not yet done

var mysql = require('mysql');
var F = require("./files.js");

async function query(sql){
    var conn = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root"
    });
    var res;
    var x = new Promise((res,rej) =>{
        conn.connect((err) => {
            if(err)F.log(err);
            else F.log("MySQL queried with sql: " + sql);
            return conn.query(sql, function (err, result) {
                if (err) F.log(err);
                F.log("database returned result "+JSON.stringify(result));
                res(result);
            });
        });
    });
    return await x;
}

exports.query = query;

