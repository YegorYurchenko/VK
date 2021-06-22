import axios from 'axios';
import { template } from 'underscore';

class EmojiTooltip {
    constructor(el) {
        this.emojiTooltip = el;
        this.messengerForm = document.querySelector(".js-message-form");
        this.smile = this.emojiTooltip.parentElement.querySelector(".js-message-smile");
        this.textarea = this.emojiTooltip.parentElement.querySelector(".js-message-textarea");
        this.emojisLists = null; // Появятся после AJAX

        // Блоки с emojis
        this.allEmojisBlock = this.emojiTooltip.parentElement.querySelector(".js-emoji-tooltip-all-emojis");
        this.allEmojisBlockWrapper = this.allEmojisBlock.parentElement;
        this.recentEmojisBlock = this.emojiTooltip.parentElement.querySelector(".js-emoji-tooltip-recent-emojis");
        this.recentEmojisBlockWrapper = this.recentEmojisBlock.parentElement;

        // Книпки переключения emojis
        this.btnAll = this.emojiTooltip.parentElement.querySelector(".js-emoji-tooltip-btn-all");
        this.btnRecent = this.emojiTooltip.parentElement.querySelector(".js-emoji-tooltip-btn-recent");

        // Объект со всеми emojis
        this.emojis = {};

        this.borderWidth = 2;
        this.formDifference = 18;
        this.maxTeaxareaHeight = 200;

        this.classes = {
            active: "is-active",
            visible: "is-visible"
        };

        this.init();
    }

    init() {
        // Получаем все emojis
        axios({
            method: this.emojiTooltip.getAttribute("data-all-emojis-method") || "get",
            url: this.emojiTooltip.getAttribute("data-all-emojis-url")
        })
            .then((response) => {
                const receivedData = response.data;
                switch (receivedData.status) {
                    case "GET_EMOJI_LIST_SUCCESS":
                        this.allEmojisBlock.innerHTML = EmojiTooltip.getEmojiData(receivedData.data, 'allEmojis');
                        this.emojis['allEmojis'] = receivedData.data;
                        break;
                    case "GET_EMOJI_LIST_FAIL":
                        console.error(receivedData.data.errorMessage);
                        break;
                    default:
                        console.error("Что-то пошло не так!");
                        break;
                }
            })
            .catch((e) => {
                console.error(e);
            });

        // Получаем последние emojis
        axios({
            method: this.emojiTooltip.getAttribute("data-recent-emojis-method") || "get",
            url: this.emojiTooltip.getAttribute("data-recent-emojis-url")
        })
            .then((response) => {
                const receivedData = response.data;
                switch (receivedData.status) {
                    case "GET_RECENT_EMOJI_LIST_SUCCESS":
                        this.recentEmojisBlock.innerHTML = EmojiTooltip.getEmojiData(receivedData.data, 'recentEmojis');
                        this.emojis['recentEmojis'] = receivedData.data;
                        this.emojisLists = this.emojiTooltip.parentElement.querySelectorAll(".js-emoji-tooltip-list");
                        this.setListeners();
                        break;
                    case "GET_RECENT_EMOJI_LIST_FAIL":
                        console.error(receivedData.data.errorMessage);
                        break;
                    default:
                        console.error("Что-то пошло не так!");
                        break;
                }
            })
            .catch((e) => {
                console.error(e);
            });
    }

    /**
     * Формируем объекты для каждого блока Emoji и создаём содержимое Tooltip через template
     * @param {Object} data - данные из AJAX-запроса
     * @returns {string}
     */
    static getEmojiData(data, typeEmojis) {
        const emojiListTemplate = document.getElementById("emoji-list-template");
        const tmpl = template(emojiListTemplate.innerHTML);
        let emojis = "";

        let lastIndex = 0; // Для уникальных id

        data.forEach((itemData, idx) => {
            const tmplData = {
                type: typeEmojis,
                part: idx,
                lastIndex,
                title: itemData.title || false,
                items: itemData.items
            };

            emojis += tmpl(tmplData);

            lastIndex += itemData.items.length;
        });

        return emojis;
    }

    /**
     * Слушаем события
     * @returns {void}
     */
    setListeners() {
        // Отслеживание выбора emoji (все типы)
        this.emojisLists.forEach(emojiList => {
            emojiList.addEventListener("click", (e) => {
                if (e.target !== e.currentTarget) {
                    this.addEmojiToTextArea(e.target);
                }
            });
        });

        // Включить вкладку со всеми emojis
        this.btnAll.addEventListener("click", () => {
            this.toggleEmojisBlock(this.btnAll, this.allEmojisBlockWrapper, this.btnRecent, this.recentEmojisBlockWrapper);
        });

        // Включить вкладку с недавними emojis
        this.btnRecent.addEventListener("click", () => {
            this.toggleEmojisBlock(this.btnRecent, this.recentEmojisBlockWrapper, this.btnAll, this.allEmojisBlockWrapper);
        });
    }

    /**
     * Добавим emoji в textarea 
     * @param {Object} el - выбранный пользователем emoji (DOM-элемент)
     * @returns {void}
     */
    addEmojiToTextArea(el) {
        const emoji = this.getEmoji(el);
        const cursorPosition = this.textarea.selectionStart; // Позиция курсора в textarea
        
        this.textarea.value = this.getNewTextareaValue(emoji, cursorPosition);

        // Изменение высоты textarea
        const textareaHeight = this.textarea.scrollHeight + this.borderWidth;
        if (textareaHeight < this.maxTeaxareaHeight) {
            this.textarea.style.height = `${textareaHeight}px`;
            this.messengerForm.style.height = `${textareaHeight + this.formDifference}px`;
            this.textarea.style.overflow = "hidden";
            this.smile.style.right = "8px";
        } else {
            this.textarea.style.height = `${this.maxTeaxareaHeight}px`;
            this.messengerForm.style.height = `${this.maxTeaxareaHeight + this.formDifference}px`;
            this.textarea.style.overflow = "auto";
            this.smile.style.right = "22px";
        }

        // Вернём курсор на выбранную пользователем позицию
        this.textarea.focus();
        this.textarea.setSelectionRange(cursorPosition + emoji.length, cursorPosition + emoji.length);
    }

    /**
     * Найдём emoji, который был выбран
     * @param {Object} selectedEmoji - выбранный пользователем emoji
     */
    getEmoji(selectedEmoji) {
        let type, part, value = 0;

        try {
            const newSelectedEmoji = selectedEmoji.querySelector('.emoji-tooltip__mainItem-list-item');

            type = newSelectedEmoji.getAttribute('data-type');
            part = newSelectedEmoji.getAttribute('data-part');
            value = newSelectedEmoji.getAttribute('data-value');
        } catch {
            type = selectedEmoji.getAttribute('data-type');
            part = selectedEmoji.getAttribute('data-part');
            value = selectedEmoji.getAttribute('data-value');
        }

        let emoji = this.emojis[type][part]['items'][value];

        return emoji;
    }

    /**
     * Получим новое значение value для textarea с учётом положения курсора, добавив emoji
     * @param {string} emoji - выбранный пользователем emoji
     * @returns {string}
     */
    getNewTextareaValue(emoji, cursorPosition) {
        const value = this.textarea.value;
        const newTextareaValue = value.slice(0, cursorPosition) + emoji + value.slice(cursorPosition);

        return newTextareaValue;
    }

    /**
     * При нажатии на копку выбора типа emojis меняем видимость блоков
     * @param {Object} btnActive - кнопка выбранного типа emojis, которую нужно активировать
     * @param {Object} blockActive - блок с emojis, который нужно показать
     * @param {Object} btnDisable - кнопка, которую нужно деактивировать
     * @param {Object} blockDisable - блок с emojis, который нужно деактивировать
     * @returns {void}
     */
    toggleEmojisBlock(btnActive, blockActive, btnDisable, blockDisable) {
        btnDisable.classList.remove(this.classes.active);
        blockDisable.classList.remove(this.classes.active);
        btnActive.classList.add(this.classes.active);
        blockActive.classList.add(this.classes.active);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const items = document.querySelectorAll(".js-emoji-tooltip");
    for (let i = 0; i < items.length; i++) {
        new EmojiTooltip(items[i]);
    }
});
