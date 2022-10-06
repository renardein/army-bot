const sub = require('../filesystem'),
    cron = require('cron').CronJob,
    answers = require('../bot/answers.js')

    
function run(bot, config) {
    const mailerJob = new cron(config.cronPattern, () => {
        let subscribersList = sub.readJsonFile('./database/subscribers.json');
        subscribersList.forEach(chatId => {
            bot.sendMessage(chatId, answers.str.mailingTempalte)
        });
        console.log('\x1b[34m',`[Maier] Notifications were sent to ${subscribersList.length} people`)
    });
    mailerJob.start();
    
}

module.exports.run = run;