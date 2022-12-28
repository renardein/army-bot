const subscriber = require('../../database/models/subscribers'),
    locale = require('../../locale'),
    timer = require('../timer'),
    configFile = require('../../config'),
    valid = require('../validators'),
    commandRegEx = /^\/(\w+)\s*(.+)?/;

async function run(bot, config) {

    bot.on('text', async msg => {
        //Обработчик команд
        const match = commandRegEx.exec(msg.text);
        if (!commandRegEx.exec(msg.text)) return;
        const command = match[1];
        const args = match[2] ? match[2].split(/\s+/) : [];

        switch (command) {
            case 'start': {
                await bot.sendAudio(msg.chat.id, 'CQACAgIAAxkBAANqYzxS_P4wP09n5lf8b68i_gQH38UAArIdAAJ2tehJbllN1BK0CtkqBA', {
                    caption: locale.start
                });
                break;
            }

            case 'about': {
                await bot.sendMessage(msg.chat.id, locale.about, { parse_mode: 'markdown', disable_web_page_preview: true });
                break;
            }

            case 'subscribe': {
                try {
                    // Проверка статуса подписки
                    if (!await subscriber.isExists(msg.chat.id)) {
                        //Если нет, то подписываем
                        await subscriber.add(msg.chat.id);
                        await bot.sendMessage(msg.chat.id, locale.userSubscribed);
                    } else {
                        await bot.sendMessage(msg.chat.id, locale.userExists);
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
                        await bot.sendMessage(msg.chat.id, locale.userUnsubscribed);
                    } else {
                        await bot.sendMessage(msg.chat.id, locale.userNotSubscribed);
                    }
                } catch (err) {
                    console.log('\x1b[41m', `[ERROR] ${err.message}`);
                }
                break;
            }

            case 'army': {
                let data = await timer.getServeTime(config.armyStartDate, 'command');
                await bot.sendMessage(msg.chat.id,
                    locale.getTemplateString(locale.army,
                        ['%startDate%', '%endDate%', '%totalDays%', '%daysPassed%', '%daysLeft%', '%subscribers%', '%progressGraphical%'],
                        [data.startDate, data.endDate, data.totalDays, data.daysPassed, data.daysLeft, data.subscribers, data.progressGraphical]),
                    { parse_mode: 'markdown' })
                break;
            }

            case 'debug': {
                const uptime = Math.round(process.uptime());
                const usedMem = Math.round(process.memoryUsage().rss / 1024 / 1024);
                const message = locale.getTemplateString(locale.debug, ['%uptime%', '%usedMem%'], [uptime, usedMem]);
                await bot.sendMessage(msg.chat.id, message, { parse_mode: 'markdown' });
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
                                    await bot.sendMessage(
                                        msg.chat.id,
                                        locale.getTemplateString(locale.newStartingPoint, ['%startingPoint%'], [date]),
                                    );
                                } catch (error) {
                                    console.error(error);
                                }
                            } else {
                                await bot.sendMessage(
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

module.exports.run = run;