const TelegramBot = require('node-telegram-bot-api'),
    fs = require('fs'),
    bot = require('./modules/bot/index.js'),
    mailer = require('./modules/mailer/index.js'),
    botCommands = JSON.parse(fs.readFileSync('database/commands.json'))
let config = JSON.parse(fs.readFileSync('config/config.json'));
api = new TelegramBot(config.telegramToken, { polling: true });

bot.run(api, config);
mailer.run(api, config);
api.setMyCommands(botCommands, { scope: { type: "all_group_chats" }, language_code: "ru" });
api.getMe().then((me) => {console.log('\x1b[32m',`@${me.username} started.`)});
api.on('message', (msg) => {console.log('\x1b[37m',`[#${msg.message_id}] [@${msg.from.username}](${msg.chat.id}) => ${msg.text}`)});
