const fs = require('fs');

function readConfig() {
    try {
        const configFile = fs.readFileSync('config/config.json', 'utf8');
        return JSON.parse(configFile);
    } catch (error) {
        console.error(error);
        return {};
    }
}

function writeConfig(config) {
    try {
        // записываем изменения в файл
        fs.writeFileSync('config/config.json', JSON.stringify(config, null, 2));
    } catch (error) {
        console.error(error);
    }
}

function setCronSchedule(cronSchedule) {
    // читаем текущую конфигурацию
    const config = readConfig();
    // изменяем параметр cronSchedule
    config.cronSchedule = cronSchedule;
    // записываем изменения в файл
    writeConfig(config);
}

function setAdminUserId(adminUserId) {
    // читаем текущую конфигурацию
    const config = readConfig();
    // изменяем параметр adminUserId
    config.adminUserId = adminUserId;
    // записываем изменения в файл
    writeConfig(config);
}

function setArmyStartDate(armyStartDate) {
    // читаем текущую конфигурацию
    const config = readConfig();
    // изменяем параметр armyStartDate
    config.armyStartDate = armyStartDate;
    // записываем изменения в файл
    writeConfig(config);
}

module.exports = {
    readConfig,
    setCronSchedule,
    setAdminUserId,
    setArmyStartDate
};
