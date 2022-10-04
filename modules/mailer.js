function run(bot, config){
   
    var myInt = setInterval(function () {
       // bot.sendMessage(93195391,i++)
    }, config.mailerInterval);
}

module.exports.run = run;