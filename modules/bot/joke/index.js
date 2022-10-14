const { VK } = require('vk-io');
require('dotenv').config();
const vk = new VK({
	token: process.env.VK_TOKEN
});

//Получает все ржомбы из ВК
async function getPostsFromPublic() {
	try {
		const posts = await vk.api.wall.get({
			owner_id: -45491419,
			count: 100,
			offset: 1
		});
		return posts.items
	}
	//Иногда ВК падает и ржомб не будет
	catch (err) {
		return "❌ Анекдота не будет. ВКонтакте [принял ислам](https://downdetector.br-analytics.ru/vkontakte)."
	}
}

//Кто виноват что в JS нет нормального генератора рандомных чисел из диапазона?
function getRandom(min, max) {
	return Math.floor(
		Math.random() * (max - min) + min
	)
}

async function getJoke() {
	//Получаем массив постов из паблика с ржекичами
	let data = await getPostsFromPublic();
	//Костыль
	if (typeof data == "object") {
		//Убираем из массива постов рекламные посты и слишком длинные ржомбы
		let filtered = data.filter(data => (data.marked_as_ads == 0 && data.text.length <= 512 && data.text != ""))
		return filtered[getRandom(1, filtered.length)].text
	}
	else return data
}

module.exports = { getJoke }