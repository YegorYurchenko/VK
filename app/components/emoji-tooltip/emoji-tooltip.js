import axios from 'axios';
import { template } from 'underscore';

class EmojiTooltip {
    constructor(el) {
        this.emojiTooltip = el;
        this.smile = this.emojiTooltip.parentElement.querySelector('.js-message-smile');
        this.mainBlock = this.emojiTooltip.parentElement.querySelector('.js-emoji-tooltip-main');

        this.closeEmojiTooltip = true;
        this.canToggleEmojiTooltip = true;

        this.classes = {
            active: 'is-active',
            visible: 'is-visible'
        }

        this.init();
    }

    init() {
        axios({
            method: this.emojiTooltip.getAttribute('data-method') || 'get',
            url: this.emojiTooltip.getAttribute('data-url'),
        })
            .then((response) => {
                const receivedData = response.data;
                switch (receivedData.status) {
                    case 'GET_EMOJI_LIST_SUCCESS':
                        this.mainBlock.innerHTML = this.getEmojiData(receivedData.data);
                        // this.setListeners();
                        break;
                    case 'GET_EMOJI_LIST_FAIL':
                        console.error(receivedData.data.errorMessage);
                        console.error(e);
                        break;
                    default:
                        console.error(e);
                        break;
                }
            })
            .catch(() => {
                console.error(e);
            });
    }

    /**
     * Формируем объекты для каждого блока Emoji и создаём содержимое Tooltip через template
     * @param data - данные из AJAX-запроса
     */
    getEmojiData(data) {
        const emojiListTemplate = document.getElementById('emoji-list-template');
        const tmpl = template(emojiListTemplate.innerHTML);
        let emojis = '';

        data.forEach((itemData, idx) => {
            const tmplData = {
                part: idx,
                title: itemData.title,
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
        this.smile.addEventListener('mouseover', () => {
            this.openTooltop();
        });

        this.smile.addEventListener('mouseout', () => {
            this.closeTooltip();
        });

        this.emojiTooltip.addEventListener('mouseover', () => {
            this.openTooltop();
        });

        this.emojiTooltip.addEventListener('mouseout', () => {
            this.closeTooltip();
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
     * Закрываем emoji tooltip (pause = 200ms)
     */
    closeTooltip() {
        this.closeEmojiTooltip = true;

        setTimeout(() => {
            if (this.closeEmojiTooltip) {
                this.canToggleEmojiTooltip = false;
                this.emojiTooltip.classList.remove(this.classes.active);

                setTimeout(() => { // Задерка для плавного скрытия tooltip
                    if (this.closeEmojiTooltip) {
                        this.emojiTooltip.classList.remove(this.classes.visible);
                        this.canToggleEmojiTooltip = true;
                    }
                }, 200);
            }
        }, 300);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const items = document.querySelectorAll('.js-emoji-tooltip');
    for (let i = 0; i < items.length; i++) {
        new EmojiTooltip(items[i]);
    }
});
