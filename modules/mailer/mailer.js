const fs = require('fs')
function run(bot, config) {

    var myInt = setInterval(function () {
        let subscribersList = JSON.parse(fs.readFileSync('database/subscribers.json'));
        subscribersList.forEach(chatId => {
            bot.sendMessage(chatId, 'Проверка рассылки')
        });

    }, config.mailerInterval);
}

module.exports.run = run;