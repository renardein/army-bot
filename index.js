const TelegramBot = require('node-telegram-bot-api'),
    fs = require('fs'),
    bot = require('./modules/bot.js'),
    mailer = require('./modules/mailer.js'),
    botCommands = JSON.parse(fs.readFileSync('commands.json'))
let config = JSON.parse(fs.readFileSync('config.json'));
api = new TelegramBot(config.telegramToken, { polling: true });

bot.run(api, config);
mailer.run(api, config);
api.setMyCommands(botCommands, { scope: { type: "all_group_chats" }, language_code: "ru" });
