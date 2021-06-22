# ![VK Messenger](project-logo.png)

## Общая информация

Задание - https://github.com/Chaptykov/VKFrontendTask

Используемые технологии: JavaScript, HTML, SASS, Underscore (template), Axios, Webpack

При работе со сборкой использовался [Node.js](https://nodejs.org/en/) версии [12.16.1](https://nodejs.org/download/release/v12.16.1/)


## Установка

1. Клонируйте репозиторий: `git clone https://github.com/YegorYurchenko/VK.git`
1. Перейдите в папку проекта `VK` и выполните команду `npm install`, которая автоматически установит все зависимости, указанные в `package.json`
1. После окончания установки в корне проекта появится каталог `node_modules` со всеми зависимостями

## Запуск

1. `npm start` - запуск сборки в режиме разработки. После запуска сборки заработает локальный сервер по адресу `http://localhost:3000`
1. `npm run production`- создаст итоговую версию проекта для production

## Структура проекта

* `app` - исходники
    * `common` - общие файлы (шрифты, изображения, стили, скрипты, данные)
        * `data` - JSON-файлы для AJAX-запросов
        * `fonts` - шрифты
        * `images` - изображения
        * `scripts` - скрипты
        * `styles` - стили
        * `svg` - svg-иконки
    * `components` - компоненты
        * `emoji-tooltip` - выпадающий интерфейс выбора эмодзи
        * `header`
        * `main` - основа страницы
        * `messenger-bottom` - форма для написания/отправки сообщения
        * `messenger-top`
        * `templates` - шаблоны для AJAX
    * `layout` - шаблоны для страниц
        * `footer.html`
        * `header.html`
    * `pages` - страницы
* `dist` - собранная верстка (для production)
    * `assets` - статические файлы
        * `css` - стили
        * `fonts` - шрифты
        * `images` - изображения
        * `js` - скрипты
    * `data` - JSON-файлы для AJAX-запросов
    * `**/*.html` - главная html-страница
* `package.json`
* `webpack.config.babel.js` - файл конфигурации Webpack
