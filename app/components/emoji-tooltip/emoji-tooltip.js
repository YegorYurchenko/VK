import axios from 'axios';
import { template } from 'underscore';

class EmojiTooltip {
    constructor(el) {
        this.emojiTooltip = el;
        this.smile = this.emojiTooltip.parentElement.querySelector('.js-message-smile');
        this.textarea = this.emojiTooltip.parentElement.querySelector('.js-message-textarea');
        this.emojisLists = null; // Появятся после AJAX

        // Блоки с emojis
        this.allEmojisBlock = this.emojiTooltip.parentElement.querySelector('.js-emoji-tooltip-all-emojis');
        this.allEmojisBlockWrapper = this.allEmojisBlock.parentElement;
        this.recentEmojisBlock = this.emojiTooltip.parentElement.querySelector('.js-emoji-tooltip-recent-emojis');
        this.recentEmojisBlockWrapper = this.recentEmojisBlock.parentElement;

        // Книпки переключения emojis
        this.btnAll = this.emojiTooltip.parentElement.querySelector('.js-emoji-tooltip-btn-all');
        this.btnRecent = this.emojiTooltip.parentElement.querySelector('.js-emoji-tooltip-btn-recent');

        // Объект со всеми emojis
        this.emojis = {};

        this.closeEmojiTooltip = true; // Закрытие tooltip?

        this.classes = {
            active: 'is-active',
            visible: 'is-visible'
        }

        this.init();
    }

    init() {
        // Получаем все emojis
        axios({
            method: this.emojiTooltip.getAttribute('data-all-emojis-method') || 'get',
            url: this.emojiTooltip.getAttribute('data-all-emojis-url'),
        })
            .then((response) => {
                const receivedData = response.data;
                switch (receivedData.status) {
                    case 'GET_EMOJI_LIST_SUCCESS':
                        this.allEmojisBlock.innerHTML = this.getEmojiData(receivedData.data, 'allEmojis');
                        this.emojis['allEmojis'] = receivedData.data;
                        break;
                    case 'GET_EMOJI_LIST_FAIL':
                        console.error(receivedData.data.errorMessage);
                        break;
                    default:
                        console.error('Что-то пошло не так!');
                        break;
                }
            })
            .catch((e) => {
                console.error(e);
            });
            
        // Получаем последние emoji
        axios({
            method: this.emojiTooltip.getAttribute('data-recent-emojis-method') || 'get',
            url: this.emojiTooltip.getAttribute('data-recent-emojis-url'),
        })
            .then((response) => {
                const receivedData = response.data;
                switch (receivedData.status) {
                    case 'GET_RECENT_EMOJI_LIST_SUCCESS':
                        this.recentEmojisBlock.innerHTML = this.getEmojiData(receivedData.data, 'recentEmojis');
                        this.emojis['recentEmojis'] = receivedData.data;
                        this.emojisLists = this.emojiTooltip.parentElement.querySelectorAll('.js-emoji-tooltip-list');
                        this.setListeners();
                        break;
                    case 'GET_RECENT_EMOJI_LIST_FAIL':
                        console.error(receivedData.data.errorMessage);
                        break;
                    default:
                        console.error('Что-то пошло не так!');
                        break;
                }
            })
            .catch((e) => {
                console.error(e);
            });
    }

    /**
     * Формируем объекты для каждого блока Emoji и создаём содержимое Tooltip через template
     * @param data - данные из AJAX-запроса
     */
    getEmojiData(data, typeEmojis) {
        const emojiListTemplate = document.getElementById('emoji-list-template');
        const tmpl = template(emojiListTemplate.innerHTML);
        let emojis = '';

        data.forEach((itemData, idx) => {
            const tmplData = {
                type: typeEmojis,
                part: idx,
                title: itemData.title || false,
                items: itemData.items
            };

            emojis += tmpl(tmplData);
        });

        return emojis;
    }

    /**
     * Слушаем события
     */
    setListeners() {
        [this.smile, this.emojiTooltip].forEach(item => {
            item.addEventListener('mouseover', () => {
                this.openTooltop();
            });
        });

        [this.smile, this.emojiTooltip].forEach(item => {
            item.addEventListener('mouseout', () => {
                this.closeTooltip();
            });
        });

        this.emojisLists.forEach(emojiList => {
            emojiList.addEventListener('click', (e) => {
                if (e.target !== e.currentTarget) {
                    this.addEmojiToTextArea(e.target);
                }
            });
        })

        this.btnAll.addEventListener('click', () => {
            this.toggleEmojisBlock(this.btnAll, this.allEmojisBlockWrapper, this.btnRecent, this.recentEmojisBlockWrapper);
        });

        this.btnRecent.addEventListener('click', () => {
            this.toggleEmojisBlock(this.btnRecent, this.recentEmojisBlockWrapper, this.btnAll, this.allEmojisBlockWrapper);
        });
    }

    /**
     * Открываем emoji tooltip
     */
    openTooltop() {
        this.closeEmojiTooltip = false;

        if (!this.emojiTooltip.classList.contains(this.classes.active)) {
            this.emojiTooltip.classList.add(this.classes.visible);

            setTimeout(() => {
                this.emojiTooltip.classList.add(this.classes.active);
            }, 33);
        }
    }

    /**
     * Закрываем emoji tooltip (pause = 300ms, animation = 200ms)
     */
    closeTooltip() {
        this.closeEmojiTooltip = true;

        setTimeout(() => {
            if (this.closeEmojiTooltip) {
                this.emojiTooltip.classList.remove(this.classes.active);

                setTimeout(() => { // Задерка для плавного скрытия tooltip
                    if (this.closeEmojiTooltip) {
                        this.emojiTooltip.classList.remove(this.classes.visible);
                    }
                }, 200);
            }
        }, 300);
    }

    /**
     * Добавим emoji в textarea 
     * @param el - выбранный пользователем emoji (DOM-элемент)
     */
    addEmojiToTextArea(el) {
        let emoji = this.getEmoji(el);

        let cursorPosition = this.textarea.selectionStart; // Позиция курсора в textarea
        this.textarea.value = this.getNewTextareaValue(emoji, cursorPosition);

        // Изменение высоты textarea
        let textareaHeight = this.textarea.scrollHeight + 2;
        if (textareaHeight < 200) {
            this.textarea.style.height = textareaHeight + "px";
            this.textarea.style.overflow = 'hidden';
            this.smile.style.right = '8px';
        } else {
            this.textarea.style.height = '200px';
            this.textarea.style.overflow = 'auto';
            this.smile.style.right = '22px';
        }

        // Вернём курсор на выбранную пользователем позицию
        this.textarea.setSelectionRange(cursorPosition + 2, cursorPosition + 2);
    }

    /**
     * Найдём emoji, который был выбран
     * @param selectedEmoji - выбранный пользователем emoji (DOM-элемент)
     */
    getEmoji(selectedEmoji) {
        let type = selectedEmoji.getAttribute('data-type');
        let part = selectedEmoji.getAttribute('data-part');
        let value = selectedEmoji.getAttribute('data-value');

        let emoji = this.emojis[type][part]['items'][value];

        return emoji;
    }

    /**
     * Получим новое значение value для textarea с учётом положения курсора, добавив emoji
     * @param emoji - выбранный пользователем emoji (type: str)
     */
    getNewTextareaValue(emoji, cursorPosition) {
        let value = this.textarea.value;
        let newTextareaValue = value.slice(0, cursorPosition) + emoji + value.slice(cursorPosition);

        return newTextareaValue;
    }

    /**
     * При нажатии на копку выбора типа emojis меняем видимость блоков
     * @param btnActive - кнопка выбранного типа emojis, которую нужно активировать
     * @param blockActive - блок с emojis, который нужно показать
     * @param btnDisable - кнопка, которую нужно деактивировать
     * @param blockDisable - блок с emojis, который нужно деактивировать
     */
    toggleEmojisBlock(btnActive, blockActive, btnDisable, blockDisable) {
        btnDisable.classList.remove(this.classes.active);
        blockDisable.classList.remove(this.classes.active);
        btnActive.classList.add(this.classes.active);
        blockActive.classList.add(this.classes.active);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const items = document.querySelectorAll('.js-emoji-tooltip');
    for (let i = 0; i < items.length; i++) {
        new EmojiTooltip(items[i]);
    }
});
