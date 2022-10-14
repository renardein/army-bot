const fs = require('fs');

//Получает [Object] после чтения JSON файла
function readJsonFile(path) {
    let data = JSON.parse(fs.readFileSync(path));
    return data;
}

//Записывает [Object] в JSON файл
function writeJsonFile(path, json) {
    fs.writeFileSync(path, JSON.stringify(json), error => console.log(error))
}


module.exports = { readJsonFile, writeJsonFile }
