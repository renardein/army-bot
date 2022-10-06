const fs = require('fs');
function readJsonFile(path) {
    var data = JSON.parse(fs.readFileSync(path));
    return data;
}

function writeJsonFile(path,json) {
    fs.writeFileSync(path, JSON.stringify(json))
}

module.exports.readJsonFile = readJsonFile;
module.exports.writeJsonFile = writeJsonFile;
