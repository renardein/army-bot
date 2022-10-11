const fsys = require('../../filesystem'),
    answers = require('../gen_answer'),
    dayjs = require('../dayjs'),
   
    cron = require('cron').CronJob;

async function run(bot, config) {

    const mailerJob = new cron(config.cronPattern, async () => {
        let subscribersList = fsys.readJsonFile('./database/subscribers.json'),
            data = await dayjs.getServeTime(config.chosenDate, 'mailer'),
            message = answers.getTemplateString(answers.mailingTempalte,
                ['%daysPassed%', '%daysLeft%', '%progress%', '%joke%'],
                [data.daysPassed, data.daysLeft, data.progress, data.joke]);
                await subscribersList.forEach(chatId => {
            bot.sendMessage(chatId, message, { parse_mode: 'markdown' })
        });
        console.log('\x1b[34m', `[Mailer] Notifications were sent to ${subscribersList.length} chats`)
    });
    //Запуск таймера рассылки через cron
     mailerJob.start();

}


module.exports.run = run;