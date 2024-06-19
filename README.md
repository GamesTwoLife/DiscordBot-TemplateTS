<h1 align="center">Ласкаво просимо до шаблону дискорд бота</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/версія-v0.6.5-blue.svg" />
  <a href="https://github.com/GamesTwoLife/DiscordBot-TemplateTS#readme" target="_blank">
    <img alt="Документація" src="https://img.shields.io/badge/Документація%3F-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/GamesTwoLife/DiscordBot-TemplateTS/graphs/commit-activity" target="_blank">
    <img alt="Підтримується" src="https://img.shields.io/badge/Підтримується%3F-yes-green.svg" />
  </a>
</p>

> Шаблон бота з **відкритим вихідним кодом** `discord.js`, який базується на офіційному [посібнику з discord.js](https://discordjs.guide/), щоб розпочати створення свого особистого бота для Discord!

### [Домашня сторінка](https://github.com/GamesTwoLife/DiscordBot-TemplateTS#readme)

## Введення

Discord Bot Template TS — це шаблон бота з відкритим вихідним кодом на основі discord.js написаний на Typescript для початку роботи над новим проектом бота. За допомогою цього шаблону можна масштабувати будь-який проект бота. (на основі одного або кількох серверів) все залежить від вашої творчості!

### Особливості:

Цей шаблон містить багато вбудованих корисних і гнучких функцій, наприклад:

#### • **Динамічний обробник подій:**

- Усі події зберігаються в в папках папці [events](https://github.com/GamesTwoLife/DiscordBot-TemplateTS/blob/master/src/events/). Вам не потрібно використовувати `client.on()` в основному файлі
- Використовуючи простий клас [`Event`](https://github.com/GamesTwoLife/DiscordBot-TemplateTS/blob/master/src/lib/Event.ts), ви легко можете створювати будь-яку кількість подій

#### • **Динамічний обробник команд:**

- Усі команди зберагіються у папках папці [commands](https://github.com/GamesTwoLife/DiscordBot-TemplateTS/blob/master/src/commands/).
- Команди можуть отримувати об'єкт [`ChatInputCommandInteraction`](https://discord.js.org/docs/packages/discord.js/14.15.3/ChatInputCommandInteraction:Class) для слеш команд або [`UserContextMenuCommandInteraction`](https://discord.js.org/docs/packages/discord.js/14.15.3/UserContextMenuCommandInteraction:Class) для команд контекстного меню користувача або [`MessageContextMenuCommandInteraction`](https://discord.js.org/docs/packages/discord.js/14.15.3/MessageContextMenuCommandInteraction:Class) для команд контекстного меню повідомлення
- **ВАЖЛИВО:** У кожної команди є параметр `devGuildOnly` який за замовченням є `true` тобто усі команди реєструються лише в 1 гільдії, тому як закінчите розробку свого прекрасного бота, не забудьте змінити цей параметр на `false` для тих команд які ви бажаєте розгорнути на всіх серверах бота

#### • **Динамічний обробник компонентів (кнопки, меню, модальні вікна, автозаповнення):**

- Легко обробляйте вхідні запити компонетів з папки [components](https://github.com/GamesTwoLife/DiscordBot-TemplateTS/blob/master/src/components/)
- Компонентів класифікуютсья в іменованих папках а саме `autocomplete`, `buttons`, `modals`, `selectmenu` в цих папках категорії і вже в них ваші файли цих компонентів, все дуже просто

#### • **Широкі можливості налаштування:**

- Користуватися шаблоном так легко та весело, ви б знали. Оскільки шаблон не залежить від будь-яких зовнішніх залежностей і написаний на typescript, його можна налаштувати будь-яким чином. Вашій творчості немає кінця!

#### • **З відкритим вихідним кодом і самостійно розміщено:**

> Це ваше, ви маєте повний контроль.

## Встановіть залежності

```sh
npm install
```

## Налаштуйте

- Налаштуйте файл [`config.ts`](https://github.com/GamesTwoLife/DiscordBot-TemplateTS/blob/master/src/config.ts) відповідно до ваших потреб!

## Запуск

Під час розробки рекомендовано запускати за допомогою команди
```sh
npm run dev
```

Під час виробницва запускайте 
```sh
npm run build
```

## Підтримка та документація

Шаблон активно підтримується, якщо виникають якісь проблеми або запитання по роботі шаблону, зверніться до [мене в Discord](https://discord.gg/users/713064369705189446)

## Автор

**GamesTwoLife**

- Github: [@GamesTwoLife](https://github.com/GamesTwoLife)
- Discord: [@gamestwolife](https://discord.gg/users/713064369705189446)

### Дописувачі

Сюди може потрапити кожен, за внесок у розвиток проекту

## Сприяння

Вітаються внески, проблеми та запити щодо функцій!
Не соромтеся перевірити [сторінку проблем](https://github.com/GamesTwoLife/DiscordBot-TemplateTS/issues).

## Продемонструйте вашу підтримку

Поставте ⭐️, якщо цей проект допоміг вам! Оцінка проекту надихає мене продовжувати його.

## Ліцензія

Copyright &copy; 2024 [GamesTwoLife](https://github.com/GamesTwoLife).<br />
Цей проект має ліцензію [Apache-2.0](LICENSE).

---
