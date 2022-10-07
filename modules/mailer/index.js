const fsys = require('../filesystem'),
    cron = require('cron').CronJob,
    answers = fsys.readJsonFile('./modules/bot/answers.json')


function run(bot, config) {
    const mailerJob = new cron(config.cronPattern, () => {
        let subscribersList = fsys.readJsonFile('./database/subscribers.json');
        subscribersList.forEach(chatId => {
            bot.sendMessage(chatId, answers.mailingTempalte, { parse_mode: 'markdown' })
        });
        console.log('\x1b[34m', `[Maier] Notifications were sent to ${subscribersList.length} chats`)
    });
    mailerJob.start();

}

module.exports.run = run;