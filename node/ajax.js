// changeable
// 

var db = require("./mySQL.js");
var F = require("./files.js");
var crypto = require('crypto');
 
async function processPost(response, body){
    F.log("POST recieved with body "+JSON.stringify(body));
    var data = new Object();
    data.status = body.status;
    try{
        switch(body.status){
            case "new":
                if(body.psw.indexOf("'") != -1)throw 'illegal letter detected';
                var x = await db.query("SELECT * FROM data.users WHERE uid = '"+body.uid+"'");
                if(x[0] != null)throw "username used";
                do{
                    data.code = crypto.randomBytes(20).toString("hex");
                    var x = await db.query("SELECT * FROM data.users WHERE uid = '"+data.code+"'");
                }while(x[0]!= null);
                var res = await db.query("INSERT INTO data.users VALUES('"+body.uid+"','"+body.psw+"','"+data.code+"')");
                data.result = "success";
                break;
            case "login":
                if(body.psw.indexOf("'") != -1)throw 'illegal letter detected';
                var x = await db.query("SELECT * FROM data.users WHERE uid = '"+body.uid+"'");
                if(x == null||x[0] == null)throw "no such user";
                if(x[0].psw != body.psw)throw "wrong password";
                data.result = "success";
                data.code = x[0].code;
                break;
            case "query":
                data.query = await db.query(body.sql);
                break;
            case "like":
                if(body.code == null)throw "user error";
                var x = await db.query("SELECT uid FROM data.users WHERE code = '"+body.code+"'");
                if(x == null||x[0] == null)throw "user error";
                var x = await db.query("SELECT liked FROM data.posts WHERE id = "+body.postId);
                if(x == null||x[0] == null||x[0].deleted == 1)throw "no such post";
                var liked = JSON.parse(x[0].liked);
                var i = liked.indexOf(body.code);
                if(i == -1)liked.push(body.code);
                else liked.splice(i,1);
                F.log("dbg");
                var x = await db.query("UPDATE data.posts SET liked = '"+JSON.stringify(liked)+"' WHERE id = "+body.postId);
                data.result = "success";
                break;
            case "retrieve":
                if(body.code == null)throw "user error";
                var x = await db.query("SELECT * FROM data.users WHERE code = '"+body.code+"'");
                if(x == null||x[0] == null)throw "user error";
                data.posts = await db.query("SELECT * FROM data.posts");
                data.result = "success";
                break;
            case "post":
                if(body.code == null)throw "user error";
                var x = await db.query("SELECT * FROM data.users WHERE code = '"+body.code+"'");
                if(x == null||x[0] == null)throw "user error";
                var uid = x[0].uid;
                var x = await db.query("INSERT INTO data.posts(creator, creatorcode, content, liked, date) VALUES ('"+uid+"', '"+body.code+"', '"+body.content+"', '"+JSON.stringify([])+"', NOW());");
                data.result = "success";
                break;
            case "edit":
                if(body.code == null)throw "user error";
                var x = await db.query("SELECT * FROM data.users WHERE code = '"+body.code+"';");
                if(x == null||x[0] == null)throw "user error";
                var uid = x[0].uid;
                var x = await db.query("UPDATE data.posts SET content = '"+body.content+"', editdate = NOW() WHERE id = "+body.postId + " AND creatorcode = '"+body.code+"';");
                data.result = "success";
                break;
            case "delete":
                if(body.code == null)throw "user error";
                var x = await db.query("SELECT * FROM data.users WHERE code = '"+body.code+"';");
                if(x == null||x[0] == null)throw "user error";
                var x = await db.query("UPDATE data.posts SET deleted = 1 WHERE id = "+body.postId + " AND creatorcode = '"+body.code+"';");
                data.result = "success";
                break;
                          }
    }catch(error){
        F.log("Got error: "+error);
        data.result = error;
    }
    function getByteLen(normal_val) {
        // Force string type
        normal_val = String(normal_val);

        var byteLen = 0;
        for (var i = 0; i < normal_val.length; i++) {
            var c = normal_val.charCodeAt(i);
            byteLen += c < (1 <<  7) ? 1 :
                       c < (1 << 11) ? 2 :
                       c < (1 << 16) ? 3 :
                       c < (1 << 21) ? 4 :
                       c < (1 << 26) ? 5 :
                       c < (1 << 31) ? 6 : Number.NaN;
        }
        return byteLen;
    }
    var msg = JSON.stringify(data);
    response.writeHead(200,{"Content-Type":"application/json","Content-Length":getByteLen(msg)});
    response.write(msg);
    F.log("message sent with data"+ msg);
}
exports.processPost = processPost;