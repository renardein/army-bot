const subscriber = require('../subscribers'),
    filesystem = require('../filesystem/'),
    answers = filesystem.readJsonFile('./modules/bot/answers.json'),
    timer = require('../servetimer'),
    dateRegEx = /\/set\s(\d{2}[./-]\d{2}[./-]\d{4}$)/;
function run(bot, config) {
    bot.onText(dateRegEx, (msg, match) => {
        if (msg.from.id == config.adminUserId) {
            bot.sendMessage(msg.chat.id, match[1]);
            config.chosenDate = match[1];
            filesystem.writeJsonFile = ('../config.json', config)
        }
        else {
            bot.sendMessage(msg.chat.id, answers.events[0].answer);
        }
    });

    bot.on('message', (msg) => {
        switch (msg.text) {
            case '/start': {
                bot.sendAudio(msg.chat.id, 'CQACAgIAAxkBAANqYzxS_P4wP09n5lf8b68i_gQH38UAArIdAAJ2tehJbllN1BK0CtkqBA', {
                    caption: answers.staticCommands[0].answer
                });
                break;
            }
            case '/about': {
                bot.sendMessage(msg.chat.id, answers.staticCommands[1].answer, { parse_mode: 'markdown' });
                break;
            }
            case '/subscribe': {
                if (!subscriber.isExists(msg.chat.id)) {
                    subscriber.add(msg.chat.id)
                    bot.sendMessage(msg.chat.id, answers.events[1].answer)
                }
                else {
                    bot.sendMessage(msg.chat.id, answers.events[2].answer)
                }
                break;
            }
            case '/unsubscribe': {
                if (subscriber.isExists(msg.chat.id)) {
                    subscriber.remove(msg.chat.id)
                    bot.sendMessage(msg.chat.id, answers.events[3].answer)
                }
                else {
                    bot.sendMessage(msg.chat.id, answers.events[4].answer)
                }
                break;
            }
            case '/debug': {
                bot.sendMessage(msg.chat.id, answers.dynamicCommands[1].answer.replace(new RegExp("%uptime%", "g"), Math.round(process.uptime())).replace(new RegExp("%usedMem%", "g"), Math.round(process.memoryUsage().rss / 1024 / 1024)), { parse_mode: 'markdown' });
                break;
            }
            case '/army': {
                bot.sendMessage(msg.chat.id, answers.dynamicCommands[0].answer.replace(new RegExp("%d%", "g"), timer.getDate(config.chosenDate).d))
                break;
            }
        }
    });

    CountForm = (number, titles) => {
        number = Math.abs(number);
        if (Number.isInteger(number)) {
            cases = [2, 0, 1, 1, 1, 2];
            return number + ' ' + titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
        }
        return titles[1];
    }
    //console.log(CountForm(1, ['рубль', 'рубля', 'рублей']));
}


module.exports.run = run;