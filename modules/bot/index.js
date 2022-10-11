const subscriber = require('../subscribers'),
    filesystem = require('../filesystem/'),
    answers = require('./gen_answer.js'),
    dayjs = require('./dayjs'),
    dateRegEx = /(\d{2}[./-]\d{2}[./-]\d{4}$)/ig;
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
                let debug = {
                    uptime: Math.round(process.uptime()),
                    usedMem: Math.round(process.memoryUsage().rss / 1024 / 1024)
                };
                bot.sendMessage(msg.chat.id, answers.getTemplateString(answers.dynamicCommands[1].answer,
                    ['%uptime%', '%usedMem%'], [debug.uptime, debug.usedMem]),
                    { parse_mode: 'markdown' });

                break;
            }
            case '/army': {

                var data = dayjs.getServeTime(config.chosenDate, 'command');

                bot.sendMessage(msg.chat.id,
                    answers.getTemplateString(answers.dynamicCommands[0].answer,
                        ['%startDate%', '%endDate%', '%totalDays%', '%daysPassed%', '%daysLeft%', '%progress%', '%subscribers%'],
                        [data.startDate, data.endDate, data.totalDays, data.daysPassed, data.daysLeft, data.progress, data.subscribers]),
                    { parse_mode: 'markdown' })
                break;
            }
            case '/set': {
                if (msg.from.id == config.adminUserId) {
                    switch (commandData[1]) {
                        case 'date': {
                            if (dateRegEx.test(commandData[2])) {
                                config.chosenDate = commandData[2];
                                filesystem.writeJsonFile = ('..../config.json', config);
                                bot.sendMessage(msg.chat.id, answers.getTemplateString(answers.events[5].answer, ['%startingPoint%'], [commandData[2]]));
                            } else {
                                bot.sendMessage(msg.chat.id, answers.getTemplateString(answers.events[6].answer, ['%startingPoint%'], [commandData[2]]));
                            }
                            break;
                        }
                        case 'cron': {
                            bot.sendMessage(msg.chat.id, commandData[2])
                            break;
                        }
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