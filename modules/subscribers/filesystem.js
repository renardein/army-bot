const fs = require('fs');
function readSubscribersFile() {
    var data = JSON.parse(fs.readFileSync('./database/subscribers.json'));
    return data;
}

function writeSubscribersFile(json) {
    fs.writeFileSync('./database/subscribers.json', JSON.stringify(json))
}

module.exports.readSubscribersFile = readSubscribersFile;
module.exports.writeSubscribersFile = writeSubscribersFile;
