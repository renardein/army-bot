const TelegramBot = require('node-telegram-bot-api'),
    bot = require('./modules/bot/index.js'),
    mailer = require('./modules/mailer/index.js'),
    fs = require('./modules/filesystem'),
    fsm = require('fs'),
    botCommands = fs.readJsonFile('modules/bot/commands.json');
require('dotenv').config();
let config = fs.readJsonFile('config.json');
api = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });
// Создание файла JSON для хранения списка подписчиков
if (!fsm.existsSync('./database/subscribers.json'))
    fsm.writeFileSync('./database/subscribers.json', '[]')
//Запуск бота
bot.run(api, config);
//Запуск рассылки 
mailer.run(api, config);
//Отправляем спискок комманд Telegram
api.setMyCommands(botCommands, { scope: { type: "all_group_chats" }, language_code: "ru" });
api.getMe().then((me) => { console.log('\x1b[32m', `@${me.username} started.`) });
api.on('message', (msg) => { console.log('\x1b[37m', `[#${msg.message_id}] [@${msg.from.username}](${msg.chat.id}) => ${msg.text}`) });
