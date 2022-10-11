const joke = require('./modules/bot/joke')
async function test(){
    console.log(await joke.getJoke())
}
test();