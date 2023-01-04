const subscriber = require('../../database/models/subscribers'),
    locale = require('../../locale'),
    timer = require('../timer'),
    configFile = require('../../config'),
    valid = require('../validators');

async function run(bot, config) {

    bot.on('text', async msg => {
        //Парсинг команд команд
        let msgData = await valid.isValidBotCommand(msg.text);
        if (!msgData)
            return;
        else {
            command = msgData.command;
            args = msgData.args;
        }

        switch (command) {
            case 'start': {
                bot.sendAudio(msg.chat.id, 'CQACAgIAAxkBAANqYzxS_P4wP09n5lf8b68i_gQH38UAArIdAAJ2tehJbllN1BK0CtkqBA', {
                    caption: locale.start
                }).catch((error) => {

                });
                break;
            }

            case 'about': {
                await sendMessage(bot, msg.chat.id, locale.about, { parse_mode: 'markdown', disable_web_page_preview: true });
                break;
            }

            case 'subscribe': {
                try {
                    // Проверка статуса подписки
                    if (!await subscriber.isExists(msg.chat.id)) {
                        //Если нет, то подписываем
                        await subscriber.add(msg.chat.id)
                        await sendMessage(bot, msg.chat.id, locale.userSubscribed);
                    } else {
                        await sendMessage(bot, msg.chat.id, locale.userExists);
                    }
                } catch (err) {
                    console.log('\x1b[41m', `[ERROR] ${err.message}`);
                }
                break;
            }

            case 'unsubscribe': {
                try {
                    // Проверка статуса подписки
                    if (await subscriber.isExists(msg.chat.id)) {
                        //Если есть, то отписываем
                        await subscriber.remove(msg.chat.id);
                        await sendMessage(bot, msg.chat.id, locale.userUnubscribed);
                    } else {
                        await sendMessage(bot, msg.chat.id, locale.userNotSubscribed);
                    }
                } catch (err) {
                    console.log('\x1b[41m', `[ERROR] ${err.message}`);
                }
                break;
            }

            case 'army': {
                let data = await timer.getServeTime(config.armyStartDate, 'command');
                await sendMessage(bot, msg.chat.id,
                    locale.getTemplateString(locale.army,
                        ['%startDate%', '%endDate%', '%totalDays%', '%daysPassed%', '%daysLeft%', '%subscribers%', '%progressGraphical%'],
                        [data.startDate, data.endDate, data.totalDays, data.daysPassed, data.daysLeft, data.subscribers, data.progressGraphical]),
                    { parse_mode: 'markdown' })
                break;
            }

            case 'debug': {
                const usedMem = Math.round(process.memoryUsage().rss / 1024 / 1024);
                const uptime = uptimeTimestamp >= 60
                    ? Math.round(process.uptime() / 60) + " минут"
                    : Math.round(process.uptime()) + " секунд";
                const message = locale.getTemplateString(locale.debug, ['%uptime%', '%usedMem%'], [uptime, usedMem]);
                await sendMessage(bot, msg.chat.id, message, { parse_mode: 'markdown' });
                break;
            }

            case 'set': {
                // Проверяем, является ли отправитель сообщения администратором
                if (msg.from.id === config.adminUserId) {
                    switch (args[0]) {
                        case 'date': {
                            let date = args[1];
                            if (await valid.isValidDate(date)) {
                                // Записываем изменения в файл конфигурации
                                try {
                                    config.armyStartDate = date
                                    configFile.setArmyStartDate(date);
                                    await sendMessage(bot,
                                        msg.chat.id,
                                        locale.getTemplateString(locale.newStartingPoint, ['%startingPoint%'], [date]),
                                    );
                                } catch (error) {
                                    console.error(error);
                                }
                            } else {
                                await sendMessage(bot, msg.chat.id, locale.getTemplateString(locale.invalidStartingPointFormat, ['%startingPoint%'], [date]))
                                await sendMessage(bot,
                                    msg.chat.id,
                                    `Неверный формат даты: ${date}`
                                );
                            }
                            break;
                        }

                        case 'mail': {

                            break;
                        }
                    }
                }
                break;
            }
        }
    });
}

async function sendMessage(bot, chatId, message) {
    await bot.sendChatAction(chatId, 'typing');
    setTimeout(async () => {
        await bot.sendMessage(chatId, message, { parse_mode: 'markdown', disable_web_page_preview: true });
    }, 500);
}

module.exports.run = run;