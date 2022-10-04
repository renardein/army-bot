const fs = require('fs');
function readSubscribersFile() {
    var array;
    fs.readFile('./subscribers.json', 'utf-8', function (err, data) {
        if (err) throw err
        array = JSON.parse(data)

    })
    return array;
}
function writeSubscribersFile(newSubList) {
    fs.writeFile('./subscribers.json', JSON.stringify(newSubList), 'utf-8', function (err) {
        if (err) throw err
        bot.sendMessage(userId, "Вы подписались на обновления!")
    })
}
module.exports.writeSubscribersFile = writeSubscribersFile;
module.exports.readSubscribersFile = readSubscribersFile;