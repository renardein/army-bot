const { VK } = require('vk-io');
const config = require('../../config');
require('dotenv').config();

let botConfig = config.readConfig();
let publics = botConfig.jokePublics;
// Создание экземпляра VK API с указанным токеном
const vk = new VK({
	token: process.env.VK_TOKEN,
});

/**
 * Получает все ржомбы из ВК
 * @returns {Promise<Array<Object> | string>} - Массив постов из публичного аккаунта или строка с сообщением об ошибке
 */
const getPostsFromPublic = async () => {

	let selectedPublic = publics[getRandom(0, publics.length)]
	try {
		const posts = await vk.api.wall.get({
			owner_id: selectedPublic,
			count: 100,
			offset: 1,
		});
		return posts.items;
	} catch (err) {
		return '❌ Анекдота не будет. ВКонтакте [принял ислам](https://downdetector.br-analytics.ru/vkontakte).';
	}
};

/**
 * Возвращает случайное число в диапазоне от min до max
 * @param {number} min - Нижняя граница диапазона
 * @param {number} max - Верхняя граница диапазона
 * @returns {number} - Случайное число из диапазона
 */

const getRandom = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Получает ржомбы из ВК
 * @returns {Promise<string>} - Ржомба
 */
const getJoke = async () => {
	// Получаем массив постов из паблика с ржекичами
	let data = await getPostsFromPublic();
	if (Array.isArray(data)) {
		// Убираем из массива постов рекламные посты и слишком длинные ржомбы
		let filtered = data.filter(data => (data.marked_as_ads === 0 && data.text.length >= 15 <= 512 && data.text !== ""));
		// Возвращаем случайную ржомбу из отфильтрованного массива

		return filtered[getRandom(1, filtered.length)].text;
	} else {
		//Или ошибку
		return data;
	}
}

module.exports = { getJoke };