
const http = require("http");
 function run(api){
    http.createServer(function(request, response){
     
    response.setHeader("UserId", 12);
    response.setHeader("Content-Type", "text/html; charset=utf-8;");
    api.getMe().then((me) => { response.write(`<h2>@${me.username} bot is running...</h2>`); });
    response.end();
}).listen(8080);
 }

module.exports.run = run;
