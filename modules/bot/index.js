const subscriber = require('../subscribers'),
    filesystem = require('../filesystem/'),
    answers = filesystem.readJsonFile('./modules/bot/answers.json'),
    timer = require('../servetimer'),
    dateRegEx = /\/set\s(\d{2}[./-]\d{2}[./-]\d{4}$)/ig
function run(bot, config) {
    bot.on('message', (msg) => {
        let commandData = msg.text.split(' ');
        switch (commandData[0]) {
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
                bot.sendMessage(msg.chat.id, answers.dynamicCommands[0].answer.replace(new RegExp("%d%", "g"), timer.getDate(config.chosenDate).d), { parse_mode: 'markdown' })
                break;
            }
            case '/set': {
                if (msg.from.id == config.adminUserId) {
                    if (dateRegEx.test(commandData[1])) {
                        config.chosenDate = commandData[1];
                        filesystem.writeJsonFile = ('../config.json', config);
                        bot.sendMessage(msg.chat.id, answers.events[5].answer.replace(new RegExp("%startingPoint%", "g"), commandData[1]));
                    } else {
                        bot.sendMessage(msg.chat.id, answers.events[6].answer.replace(new RegExp("%startingPoint%", "g"), commandData[1]));
                    }
                }
                else {
                    bot.sendMessage(msg.chat.id, answers.events[2].answer);
                }
                break;
            }
        }
    });

}




module.exports.run = run;