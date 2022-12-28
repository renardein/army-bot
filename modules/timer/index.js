const dayjs = require('dayjs');
const joke = require('../joke');
const customParseFormat = require('dayjs/plugin/customParseFormat');
const subscriber = require("../../database/models/subscribers");

dayjs.extend(customParseFormat);

/**
 * Получает данные для шаблона сообщения
 * @param {string} startTime - Дата начала в формате "DD-MM-YYYY"
 * @param {string} type - Тип данных (command или mailer)
 * @param {import('vk-io').VK} [vk] - Экземпляр VK API (только для type === 'mailer')
 * @returns {Object}
 */
async function getServeTime(startTime, type) {
    const startDate = dayjs(startTime, "DD-MM-YYYY", 'ru', true);
    const endDate = startDate.add(1, 'year');
    const subscribersCount = await subscriber.count()
    let data;
    switch (type) {
        case 'command': {
            let data = {
                startDate: startDate.format('DD-MM-YYYY'), //Дата начала
                endDate: endDate.format('DD-MM-YYYY'),//Дата конца
                totalDays: endDate.diff(startDate, 'day'),  // Дней всего
                daysPassed: dayjs().diff(startDate, 'day'),  // Дней прошло
                daysLeft: endDate.diff(dayjs(), 'day'), //Дней осталось
                progressGraphical: generateProgressBar((dayjs().diff(startDate, 'day') / endDate.diff(startDate, 'day') * 100).toFixed(4)),
                subscribers: subscribersCount //Количество подписчиков

            }

            return data;

        }
        case 'mailer': {
            let data = {
                daysPassed: dayjs().diff(startDate, 'day'),  // Дней прошло
                daysLeft: endDate.diff(dayjs(), 'day'), //Дней осталось
                progressGraphical: generateProgressBar((dayjs().diff(startDate, 'day') / endDate.diff(startDate, 'day') * 100).toFixed(4)),
                joke: await joke.getJoke() // Ржомба
            }
            return data;
        }
    }

    return data
}

function generateProgressBar(percentage) {
    percentage = Math.min(percentage, 100);  // ограничиваем percentage значением 100

    const progressBarLength = 14;
    const progressBarFilled = Math.floor(percentage / (100 / progressBarLength));
    const progressBarEmpty = progressBarLength - progressBarFilled;

    let progressBar = '';
    for (let i = 0; i < progressBarFilled; i++) {
        progressBar += '🟩';
    }
    for (let i = 0; i < progressBarEmpty; i++) {
        progressBar += '⬜';
    }

    return `[${progressBar}] ${percentage}%`;
}

module.exports = { getServeTime };