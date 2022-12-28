const cronRegEx = /^((\*|[0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9]) (\*|[0-9]|1[0-9]|2[0-3]) (\*|[1-9]|1[0-9]|2[0-9]|3[0-1]) (\*|[1-9]|1[0-2]) (\*|[0-6]))$/;
const dateRegEx = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[012])-\d{4}$/;
const commandRegEx = /^\/(\w+)\s*(.+)?/;

async function isValidDate(date) {
    if (!dateRegEx.test(date)) {
        return false;
    }

    // Дата соответствует формату ДД-ММ-ГГГГ, продолжаем проверку
    const [day, month, year] = date.split('-').map(Number);
    const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // Проверяем, что месяц находится в допустимом диапазоне
    if (month < 1 || month > 12) {
        return false;
    }

    // Проверяем, что год является високосным, если это необходимо
    if (month === 2 && (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0)) {
        monthDays[1] = 29;
    }

    // Проверяем, что количество дней в месяце соответствует допустимому значению
    return day >= 1 && day <= monthDays[month - 1];
}


function isValidCronExpression(cronExpression) {
    return cronRegEx.test(cronExpression);
}

async function isValidBotCommand(message) {
    const match = commandRegEx.exec(message);
    if (!match) {
        return false;
    } else {
        const command = match[1];
        const args = match[2] ? match[2].split(/\s+/) : [];
        return {
            command,
            args
        };
    }
}
module.exports = { isValidDate, isValidCronExpression, isValidBotCommand }