const TelegramBot = require('node-telegram-bot-api'),
    bot = require('./modules/bot'),
    mailer = require('./modules/bot/mailer'),
    fs = require('fs'),
    botCommands = JSON.parse(fs.readFileSync('modules/bot/commands.json')),
    process = require('process'),
    db = require('./database/dbAdapter')
require('dotenv').config();

let config = JSON.parse(fs.readFileSync('config.json'));
api = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

//Запуск бота
async function start() {
    // Запуск бота
    await bot.run(api, config);
    // Получение информации о боте и вывод сообщения о старте
    const botInfo = await api.getMe();
    console.log('\x1b[32m', `[Bot] @${botInfo.username} started.`);

    // Запуск рассылки
    await mailer.run(api, config).then(() => {
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
    // Регулярно выводим информацию о используемой памяти в консоль
    setInterval(
        () =>
            console.log(
                '\x1b[37m',
                `[Debug] Used ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)}MB of RAM`
            ),
        900000
    );
}


start();