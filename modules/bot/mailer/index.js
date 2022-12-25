const fs = require('fs'),
    answers = require('../gen_answer'),
    dayjs = require('../timer'),
    cron = require('cron').CronJob;

let mailerJob;

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

async function run(bot, config) {
    mailerJob = new cron(config.cronPattern, async () => {
        try {
            //Получаем массив с chatId подписанных
            const subscribersList = JSON.parse(await fs.promises.readFile('database/subscribers.json'));
            //Получаем данные с расчетами даты и дней
            const data = await dayjs.getServeTime(config.chosenDate, 'mailer');
            //Подменяем переменные в шаблоне сообщений
            const message = answers.getTemplateString(answers.mailingTempalte,
                ['%daysPassed%', '%daysLeft%', '%progress%', '%joke%'],
                [data.daysPassed, data.daysLeft, data.progress, data.joke]);

            await sendMessages(bot, subscribersList, message);

            console.log('\x1b[34m', `[Mailer] Notifications were sent to ${subscribersList.length} chats`);
        } catch (err) {
            console.log('\x1b[41m', `[ERROR] ${err.message}`);
        }
    });

    //Запуск таймера рассылки через cron
    mailerJob.start();
}

module.exports = {
    run,
    mailerJob
};