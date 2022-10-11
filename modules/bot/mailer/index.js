const fsys = require('../../filesystem'),
    cron = require('cron').CronJob,
    answers = require('../gen_answer'),
    dayjs = require('../dayjs')

function run(bot, config) {

    const mailerJob = new cron(config.cronPattern, () => {
        let subscribersList = fsys.readJsonFile('./database/subscribers.json'),
            data = dayjs.getServeTime(config.chosenDate, 'command'),
            message = answers.getTemplateString(answers.mailingTempalte,
                ['%daysPassed%', '%daysLeft%', '%progress%'],
                [data.daysPassed, data.daysLeft, data.progress]);
        subscribersList.forEach(chatId => {
            bot.sendMessage(chatId, message, { parse_mode: 'markdown' })
        });
        console.log('\x1b[34m', `[Maier] Notifications were sent to ${subscribersList.length} chats`)
    });
    //Запуск таймера рассылки через cron
    mailerJob.start();

}

module.exports.run = run;