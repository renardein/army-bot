const fs = require('fs'),
    cron = require('cron').CronJob;
function run(bot, config) {
    const mailerJob = new cron(config.cronPattern, () => {
        let subscribersList = JSON.parse(fs.readFileSync('database/subscribers.json'));
        subscribersList.forEach(chatId => {
            bot.sendMessage(chatId, 'Проверка рассылки')
        });
    });
    mailerJob.start();
}

module.exports.run = run;