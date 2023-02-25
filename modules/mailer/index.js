const cron = require('cron').CronJob;
const locale = require('../../locale');
const timer = require('../timer');
const subscriber = require('../../database/models/subscribers');

let mailerJob;

async function run(bot, config) {
    mailerJob = new cron(config.cronSchedule, async () => {
        try {
            //Получаем массив с chatId подписанных
            let subscribersList = await subscriber.getAll();
            //Если массив с подписчиками пустой, то отменяем выполнение функции
            if (subscribersList.length === 0) {
                console.log('\x1b[34m', `[Mailer] No available subscribers to send messages`);
                return;
            }
            //Получаем данные с расчетами даты и дней
            const data = await timer.getServeTime(config.armyStartDate, 'mailer');
            //Подменяем переменные в шаблоне сообщений
            const message = locale.getTemplateString(locale.mailingTempalte,
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
            await bot.sendChatAction(chatId, 'typing');
            await bot.sendMessage(chatId, message, { parse_mode: 'markdown', disable_web_page_preview: true }).then(function () {
                // Пауза в 1 секунду
                setTimeout(resolve, 1000);
            })
        } catch (err) {
            console.log('\x1b[41m', `[ERROR] ${err.message}`);
        }
    }
}
module.exports = {
    run,
    mailerJob
};