const { VK } = require('vk-io');
require('dotenv').config();
const vk = new VK({
	token:  process.env.VK_TOKEN
});

async function getJoke(){
const posts = await vk.api.wall.get({
	owner_id: -85443458,
    count: 100
});

return posts.items[between(0,99)].text
}

function between(min, max) {  
	return Math.floor(
	  Math.random() * (max - min) + min
	)
  }
module.exports={getJoke}