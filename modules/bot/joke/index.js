const { VK } = require('vk-io');
require('dotenv').config();
const vk = new VK({
	token: process.env.VK_TOKEN
});

async function getPostsFromPublic() {
	try {
		const posts = await vk.api.wall.get({
			owner_id: -85443458,
			count: 100
		});
		return posts.items
	}
	catch (err) {
		return "❌ Анекдота не будет. ВКонтакте [принял ислам](https://downdetector.br-analytics.ru/vkontakte)."
	}
}

function getRandom(min, max) {
	return Math.floor(
		Math.random() * (max - min) + min
	)
}

async function getJoke() {

	let data = await getPostsFromPublic();
	if (typeof data == "object") {
		let filtered = data.filter(data => (data.marked_as_ads == 0 && data.text.length <= 512))
		return filtered[getRandom(1, filtered.length)].text
	}
	else return data
}
module.exports = { getJoke }