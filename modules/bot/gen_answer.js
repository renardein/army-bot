filesystem = require('../filesystem/'),
answers = filesystem.readJsonFile('./modules/bot/answers.json');


function getTemplateString(string,variables, values){
 variables.forEach(function (value, i) {
  string = string.replace(value, values[i])
});

 return string;
}

module.exports=answers;
module.exports.getTemplateString = getTemplateString;