const e = require('express');
const subscriber = require('../subscribers')
const dateRegEx = /\/set\s(\d{2}[./-]\d{2}[./-]\d{4}$)/;
function run(bot, config) {
    bot.onText(dateRegEx, (msg, match) => {
        if (msg.from.id == config.adminUserId) {

            bot.sendMessage(msg.chat.id, match[1]);
        }
        else {
            bot.sendMessage(msg.chat.id, "У тебя нет прав для установки даты.");
        }
    });

    bot.on('message', (msg, match) => {
        console.log(msg)
        switch (msg.text) {
            case '/start': {
                bot.sendAudio(msg.chat.id, 'CQACAgIAAxkBAANqYzxS_P4wP09n5lf8b68i_gQH38UAArIdAAJ2tehJbllN1BK0CtkqBA', {
                    caption: `
Привет!
Чтобы узнать зачем этот бот существует отправь /about
Для подписки на рассылку отправь /subscribe
Для отказа от подписки отправь /unsubscribe`
                });
                break;
            }
            case '/about': {
                bot.sendMessage(msg.chat.id, `
Этот бесполезный бот создан для оповещения о том, сколько мне осталось служить в армии.
                
                
Упоролся и разработал @renardein 
GitHub: https://github.com/renardein/army-timer-bot
Основано на <a href="https://github.com/yagop/node-telegram-bot-api/">библиотеке</a> от <a href="https://telegram.me/node_telegram_bot_api">@yagop</a>`, { parse_mode: 'HTML' });

                break;
            }
            case '/subscribe': {
                if (subscriber.isExists() !== true) {
                    subscriberId = msg.chat.id
                    subscriber.add(subscriberId)
                    bot.sendMessage(msg.chat.id, "Вы подписались на обновления")
                }
                else {
                    bot.sendMessage(msg.chat.id, "Вы уже подписаны")
                }



                break;
            }
            case '/unsubscribe': {
                subscriberId = msg.chat.id
                subscriber.remove(subscriberId)
                bot.sendMessage(msg.chat.id, "Вы отписались от обновалений")
                break;
            }
            case '/debug': {

                bot.sendMessage(msg.chat.id, process.uptime())
                break;
            }
        }

    });
}

module.exports.run = run;