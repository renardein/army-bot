const TelegramBot = require('node-telegram-bot-api'),
    bot = require('./modules/bot/index.js'),
    mailer = require('./modules/mailer/index.js'),
    fs = require('./modules/filesystem')
    botCommands = fs.readJsonFile('modules/bot/commands.json');
    require('dotenv').config();
let config = fs.readJsonFile('config.json');
api = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

bot.run(api, config);
mailer.run(api, config);
api.setMyCommands(botCommands, { scope: { type: "all_group_chats" }, language_code: "ru" });
api.getMe().then((me) => { console.log('\x1b[32m', `@${me.username} started.`) });
api.on('message', (msg) => { console.log('\x1b[37m', `[#${msg.message_id}] [@${msg.from.username}](${msg.chat.id}) => ${msg.text}`) });
//test