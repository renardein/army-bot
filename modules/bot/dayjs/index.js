const dayjs = require('dayjs'),
    fsm = require('../../filesystem');
customParseFormat = require('dayjs/plugin/customParseFormat'),
    utc = require('dayjs/plugin/utc'),
    timezone = require('dayjs/plugin/timezone') // dependent on utc plugin
dayjs.extend(customParseFormat);
dayjs.extend(timezone);
dayjs.extend(utc);
dayjs.tz.setDefault("Asia/Krasnoyarsk")
const datetime = "2014-06-01 12:00";
const tz = "America/New_York"
function getServeTime(startTime, type) {

    const startDate = dayjs(startTime, "DD-MM-YYYY", 'ru', true),
        endDate = dayjs(startTime, "DD-MM-YYYY", 'ru', true).add(1, 'year');

    switch (type) {
        case 'command': {
            let data = {
                startDate: startDate.format('DD-MM-YYYY'), //Дата начала
                endDate: endDate.format('DD-MM-YYYY'),//Дата конца
                totalDays: endDate.diff(startDate, 'day'),  // Дней всего
                daysPassed: dayjs().diff(startDate, 'day'),  // Дней прошло
                daysLeft: endDate.diff(dayjs(), 'day'), //Дней осталось
                progress: Math.round(dayjs().diff(startDate, 'day') / endDate.diff(startDate, 'day') * 100), //Прогресс в процентах
                subscribers: fsm.readJsonFile('database/subscribers.json').length //Количество подписчиков
            }

            return data;

        }
        case 'mailer': {
            let data = {
                daysPassed: dayjs().diff(startDate, 'day'),  // Дней прошло
                daysLeft: endDate.diff(dayjs(), 'day'), //Дней осталось
                progress: Math.round(dayjs().diff(startDate, 'day') / endDate.diff(startDate, 'day') * 100), //Прогресс в процентах
            }
            return data;
        }
    }

    return data
}

module.exports = { getServeTime };