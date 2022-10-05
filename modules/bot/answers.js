const fs = require('fs');
const answers = fs.readFileSync('./modules/bot/answers.json');
const str = JSON.parse(answers)


module.exports.str = str;