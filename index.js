const TelegramBot = require('node-telegram-bot-api'),
    bot = require('./modules/bot'),
    mailer = require('./modules/bot/mailer'),
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
async function start() {
    await bot.run(api, config);
    await api.getMe().then((me) => { console.log('\x1b[32m', `[Bot] @${me.username} started.`) });
    //Запуск рассылки 
    await mailer.run(api, config).then((l) => { console.log('\x1b[34m', `[Mailer] Mailer started`) });
    //Отправляем спискок комманд Telegram
    await api.setMyCommands(botCommands.private, { scope: { type: "all_private_chats" }, language_code: "ru" });
    await api.setMyCommands(botCommands.public, { scope: { type: "all_group_chats" }, language_code: "ru" });
    //Консколька
    await api.on('message', (msg) => { console.log('\x1b[37m', `[Bot][#${msg.message_id}] [@${msg.from.username}](${msg.chat.id}) => ${msg.text}`) });
    setInterval(() => console.log('\x1b[37m', `[Debug] Used ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)}MB of RAM`), 900000);
}
start();