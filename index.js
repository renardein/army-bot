const { config } = require('dotenv');
const TelegramBot = require('node-telegram-bot-api');
const bot = require('./modules/bot');
const mailer = require('./modules/bot/mailer');
const fs = require('fs');
const botCommands = JSON.parse(fs.readFileSync('modules/bot/commands.json'));
const process = require('process');
const { readConfig } = require('./config');

require('dotenv').config();

let currentConfig = readConfig();
api = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

//Запуск бота
async function start() {
    // Запуск бота
    await bot.run(api, currentConfig);
    // Получение информации о боте и вывод сообщения о старте
    const botInfo = await api.getMe();
    console.log('\x1b[32m', `[Bot] @${botInfo.username} started.`);

    // Запуск рассылки
    await mailer.run(api, currentConfig).then(() => {
        console.log('\x1b[34m', `[Mailer] Mailer started`);
    });

    // Установка команд бота в Telegram
    await api.setMyCommands(botCommands.private, {
        scope: { type: 'all_private_chats' },
        language_code: 'ru',
    });
    await api.setMyCommands(botCommands.public, {
        scope: { type: 'all_group_chats' },
        language_code: 'ru',
    });
    //Консколька
    // Выводим информацию о полученных сообщениях в консоль
    api.on('message', (msg) => {
        console.log(
            '\x1b[37m',
            `[Bot][#${msg.message_id}] [@${msg.from.username}](${msg.chat.id}) => ${msg.text}`
        );
    });
}


start();