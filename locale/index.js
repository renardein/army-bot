const fs = require('fs');
const answers = JSON.parse(fs.readFileSync('locale/answers.json'));


//Заменяет %переменные% в строке на их значения
function getTemplateString(string, variables, values) {
  variables.forEach(function (value, i) {
    string = string.replace(value, values[i])
  });

  return string;
}

module.exports = answers;
module.exports.getTemplateString = getTemplateString;