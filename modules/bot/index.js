const subscriber = require('../subscribers'),
    filesystem = require('../filesystem/'),
    answers = require('./gen_answer.js'),
    dayjs = require('./dayjs'),
    dateRegEx = /(\d{2}[./-]\d{2}[./-]\d{4}$)/ig;

async function run(bot, config) {
    bot.on('text', async msg => {
        let commandData = msg.text.split(' '); //Корявый парсинг аргументов
        switch (commandData[0]) {
            case '/start': {
                await bot.sendAudio(msg.chat.id, 'CQACAgIAAxkBAANqYzxS_P4wP09n5lf8b68i_gQH38UAArIdAAJ2tehJbllN1BK0CtkqBA', {
                    caption: answers.staticCommands[0].answer
                });
                break;
            }
            case '/about': {
                await bot.sendMessage(msg.chat.id, answers.staticCommands[1].answer, { parse_mode: 'markdown', disable_web_page_preview: true });
                break;
            }
            case '/subscribe': {
                //Проверка статуса подписки
                if (!subscriber.isExists(msg.chat.id)) {
                    subscriber.add(msg.chat.id)
                    await bot.sendMessage(msg.chat.id, answers.events[1].answer)
                }
                else
                    await bot.sendMessage(msg.chat.id, answers.events[2].answer)
                break;
            }
            case '/unsubscribe': {
                //Проверка статуса подписки
                if (subscriber.isExists(msg.chat.id)) {
                    subscriber.remove(msg.chat.id)
                    await bot.sendMessage(msg.chat.id, answers.events[3].answer)
                }
                else
                    await bot.sendMessage(msg.chat.id, answers.events[4].answer)
                break;
            }
            case '/debug': {
                //Отладочная информация: аптайм скрипта и съеденная им память
                let debug = {
                    uptime: Math.round(process.uptime()),
                    usedMem: Math.round(process.memoryUsage().rss / 1024 / 1024)
                };
                await bot.sendMessage(msg.chat.id, answers.getTemplateString(answers.dynamicCommands[1].answer,
                    ['%uptime%', '%usedMem%'], [debug.uptime, debug.usedMem]),
                    { parse_mode: 'markdown' });
                break;
            }
            case '/army': {

                let data = await dayjs.getServeTime(config.chosenDate, 'command');

                await bot.sendMessage(msg.chat.id,
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
                                await bot.sendMessage(msg.chat.id, answers.getTemplateString(answers.events[5].answer, ['%startingPoint%'], [commandData[2]]));
                            } else
                                await bot.sendMessage(msg.chat.id, answers.getTemplateString(answers.events[6].answer, ['%startingPoint%'], [commandData[2]]));

                            break;
                        }
                        case 'cron': {
                            let time = commandData[2].split(':');
                            let cronPattern = `${time[1]} ${time[0]} * * *`
                            await bot.sendMessage(msg.chat.id, `${commandData[2]} => ${cronPattern}`)
                            break;
                        }
                    }
                }
                else
                    await bot.sendMessage(msg.chat.id, answers.events[2].answer);

                break;
            }
        }
    });
    bot.on('my_chat_member', (async msg => {
        console.log(msg)
        if (msg.new_chat_member.user.id = 5382306522 && msg.new_chat_member.status == 'member' && msg.chat.type == 'group') {
            if (!subscriber.isExists(msg.chat.id)) {
                subscriber.add(msg.chat.id)
                await bot.sendMessage(msg.chat.id, answers.getTemplateString(answers.events[7].answer, ['%chatName%'], [msg.chat.title]))
            }
        }
        else
            subscriber.remove(msg.chat.id)
    }))
}

module.exports.run = run;