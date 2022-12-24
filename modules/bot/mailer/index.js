const fs = require('fs'),
    answers = require('../gen_answer'),
    dayjs = require('../timer'),
    cron = require('cron').CronJob;

async function run(bot, config) {
    const mailerJob = new cron(config.cronPattern, async () => {

        //Получаем массив с chatId подписанных
        let subscribersList = JSON.parse(fs.readFileSync('database/subscribers.json')),
            //Получаем данные с расчетами даты и дней
            data = await dayjs.getServeTime(config.chosenDate, 'mailer'),
            //Подменяем переменные в шаблоне сообщений
            message = answers.getTemplateString(answers.mailingTempalte,
                ['%daysPassed%', '%daysLeft%', '%progress%', '%joke%'],
                [data.daysPassed, data.daysLeft, data.progress, data.joke]);
        //Рассылаем по списку
        await subscribersList.forEach(chatId => {
            try {
                bot.sendMessage(chatId, message, { parse_mode: 'markdown', disable_web_page_preview: true })
            }
            catch (err) {
                console.log('\x1b[41m', `[ERROR] ${err.message}`)
            }
        });
        console.log('\x1b[34m', `[Mailer] Notifications were sent to ${subscribersList.length} chats`)
        subscribersList, data, message = null;
    });

    //Запуск таймера рассылки через cron
    mailerJob.start();

}


module.exports.run = run;