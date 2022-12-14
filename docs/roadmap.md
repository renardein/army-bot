## Дорожная карта

### Конфигурация

- [ ] Создавать пустой файл конфигурации, если его не существует
- [ ] Если в файле конфигурации не задана дата - команда `/army` и рассылка не должны работать
- [ ] Если в файле конфигурации не задан администратор - команда `/set` не должна работать
- [ ] Если в файле конфигурации не задано cron выражение - рассылка не должна работать

### Механизм подписки на обновления

##### Важно
- [ ] Если пользователь блокирует бота, то происходит автоматическое удаление пользователя из списка рассылки
- [ ] Если в список рассылки попал ID, который возвращает `ETELEGRAM: 400 Bad Request` - этот ID удаляется из списка
##### Реализовано
- [x] Возможность подписаться на обновления
- [x] Возможность отписаться от обновлений
- [x] Проверка статуса подписки
- [x] При добавлении бота в чат происходит автоматическая подписка данного чата на рассылку
- [x] При удалении бота из чата происходит автоматическая отписка данного чата


### Рассылка

##### Важно
- [ ] Установка времени рассылки командой `/set mail hh:mm` или `/set mail <интервал в минутах>`
- [ ] Глобальное отключение рассылки коммандой `/set mail off`
##### Не реализовано
- [ ] Гибкая настройка периодичности рассылки
- [ ] Выводить источник ржомб в `/about`
- [ ] Возможность задавать имя отслеживаемого
##### Реализовано
- [x] Таймер рассылки (cronJob)
- [x] Механизм рассылки
- [x] Шаблон сообщения рассылки
- [x] Получать рандомную ржомбу из рандомного сообщества ВКонтакте указанного в списке

 
### Счетчики

##### Не реализовано
- [ ] Отслеживание окончания службы. В случае если `daysLeft` равно нулю - отправить последнее сообщение в рассылке с уведомлением о том что служба окончена и отключить рассылку
##### Реализовано
- [x] Установка даты
- [x] Статистика службы (дата начала, дата окончания, дней прошло, дней осталось, прогресс-бар)
- [x] Рефакторинг механизма установки даты

### База данных

##### Важно
- [ ] Переехать с SQLite3 на PostgreSQL
##### Реализовано
- [x] Использовать базу данных вместо JSON файла

### Команды

- [x] Исправить отправку файла в ответ на команду `/start`
- [ ] Выводить спистк команд в `/help` из файла `сonfig/commands.json`

### Разработка

##### Важно
- [ ] Переработать обработку ошибок
- [ ] Повысить общее качество кода
- [ ] Оптимизация

##### Не реализовано
- [ ] Модульность (одна команда - один js файл) с горячим подключением
- [ ] Логгирование (попробовать [winston](https://github.com/winstonjs/winston))
- [ ] Документация (зачем?)

##### Реализовано
- [x] Асинхронность
- [x] Объеденить некоторые модули, слишком много ООП
- [x] Обработка ошибок


### Тестирование
- [ ] Разработать unit-тесты для счетчика

### Отдаленные планы

- [ ] Глобализация. Каждый пользователь может отслеживать произвольный список лиц
- [ ] Глобализация. Каждый пользователь может настроить периодичность рассылки самостоятельно
