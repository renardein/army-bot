const answers = require('../gen_answer'),
    dayjs = require('../timer'),
    cron = require('cron').CronJob,
    subscriber = require('../../../database/models/subscribers')

let mailerJob;

async function run(bot, config) {
    mailerJob = new cron(config.cronSchedule, async () => {
        try {
            //Получаем массив с chatId подписанных
            let subscribersList = await subscriber.getAll();
            //Получаем данные с расчетами даты и дней
            const data = await dayjs.getServeTime(config.armyStartDate, 'mailer');
            //Подменяем переменные в шаблоне сообщений
            const message = answers.getTemplateString(answers.mailingTempalte,
                ['%daysPassed%', '%daysLeft%', '%joke%', '%progressGraphical%'],
                [data.daysPassed, data.daysLeft, data.joke, data.progressGraphical]);

            await sendMessages(bot, subscribersList, message);

            console.log('\x1b[34m', `[Mailer] Notifications were sent to ${subscribersList.length} chats`);
        } catch (err) {
            console.log('\x1b[41m', `[ERROR] ${err.message}`);
        }
    });
    //Запуск таймера рассылки через cron
    mailerJob.start();
}

async function sendMessages(bot, subscribersList, message) {
    for (const chatId of subscribersList) {
        try {
            await bot.sendMessage(chatId, message, { parse_mode: 'markdown', disable_web_page_preview: true });
            // Пауза в 1 секунду
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (err) {
            console.log('\x1b[41m', `[ERROR] ${err.message}`);
        }
    }
}
module.exports = {
    run,
    mailerJob
};