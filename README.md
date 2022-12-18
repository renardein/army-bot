# Army Bot
### Что это такое?
Этот бесполезный бот создан для оповещения о том, сколько мне осталось служить в армии.
(У меня шизофрения)
### Как это работает?
Примерно так<br>
![scr1](https://github.com/renardein/army-bot/blob/master/assets/scr.PNG?raw=true)
![scr2](https://github.com/renardein/army-bot/blob/master/assets/scr1.PNG?raw=true)
![scr3](https://github.com/renardein/army-bot/blob/master/assets/scr2.PNG?raw=true)
### Дорожная карта
  ##### Механизм подписки на обновления
  - [x] Возможность подписаться на обновления
  - [x] Возможность отписаться от обновлений
  - [x] Проверка статуса подписки
  - [x] При добавлении бота в чат происходит автоматическая подписка данного чата на рассылку
  - [x] При удалении бота из чата происходит автоматическая отписка данного чата
  ##### Mailer
  - [x] Таймер рассылки (cronJob)
  - [ ] Установка cron- аттерна через команду бота
  - [x] Механизм рассылки
  - [x] Шаблон сообщения рассылки
  - [x] Приколясики в рассылке
  ##### Счетчики
  - [x] Установка даты (needs some refactoring)
  - [x] Статистика службы (дата начала, дата окончания, дней прошло, дней осталось, процент)
  ##### Разработка
  - [ ] Use a Database instead of JSON
  - [ ] async/await
  - [ ] Optimization?
  - [ ] Merge some modules
  - [ ] Error Handling
  - [ ] Rewrite logger