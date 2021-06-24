import MessageArea from '../main/main';

class MessengerBottom {
    constructor(el) {
        this.messenger = el;
        this.messengerForm = this.messenger.querySelector(".js-message-form");
        this.messengerFormEnter = this.messenger.querySelector(".js-message-form-enter");
        
        this.textarea = this.messenger.querySelector(".js-message-textarea");
        this.smile = this.messenger.querySelector(".js-message-smile");
        this.emojiTooltip = this.messenger.querySelector(".js-emoji-tooltip");

        this.borderWidth = 2;
        this.formDifference = 18;
        this.maxTeaxareaHeight = 200;

        this.selectedEmoji = null;

        this.canToggleEmojiTooltip = true;

        this.classes = {
            active: "is-active",
            visible: "is-visible"
        };

        this.init();
        this.setListeners();
    }

    /**
     * Инициализация класса отправки сообщений
     * @returns {void}
     */
    init() {
        this.MessageArea = new MessageArea();
    }

    /**
     * Слушаем события
     * @returns {void}
     */
    setListeners() {
        // Динамически изменяем высоту textarea при необходимости
        this.textarea.addEventListener("input", e => {
            const textarea = e.target;

            textarea.style.height = "auto";

            const textareaHeight = textarea.scrollHeight + this.borderWidth;

            if (textareaHeight < this.maxTeaxareaHeight) {
                textarea.style.height = `${textareaHeight}px`;
                this.messengerForm.style.height = `${textareaHeight + this.formDifference}px`;
                textarea.style.overflow = "hidden";
                this.smile.style.right = "8px";
            } else {
                textarea.style.height = `${this.maxTeaxareaHeight}px`;
                this.messengerForm.style.height = `${this.maxTeaxareaHeight + this.formDifference}px`;
                textarea.style.overflow = "auto";
                this.smile.style.right = "22px";
            }
        });

        // Отправка сообщения по button
        this.messengerFormEnter.addEventListener('click', () => {
            this.sendMessage();
            this.textarea.focus();
        });

        // Отправка сообщения по Ctrl+Enter
        this.textarea.addEventListener("keydown", e => {
            if ((e.ctrlKey || e.metaKey) && e.keyCode == 13) {
                this.sendMessage(e);

                if (this.emojiTooltip.classList.contains(this.classes.visible)) {
                    this.closeEmojiTooltip();
                }
            }
        });

        // Переключение видимости emoji tooltip
        this.smile.addEventListener("click", () => {
            this.toggle();
        });

        // Закрытие emoji tooltip при клике вне блока
        document.body.addEventListener('click', (e) => {
            this.handleMilkClick(e);
        });

        // Доступность emojis с помощью Tab
        document.body.addEventListener("keydown", e => {
            if (e.key === "Tab") { // Открываем/закрываем tooltip
                e.preventDefault();
                this.toggle();
                this.selectedEmoji = null;
            }
            else if ( // Двигаемся по emojis
                ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].indexOf(e.key) >= 0
                && this.emojiTooltip.classList.contains(this.classes.visible)
            ) {
                e.preventDefault();
                this.emojiTooltipNavigation(e.key);
            }
            else if ( // Выбираем emoji и закрывает tooltip
                e.key === "Enter"
                && this.emojiTooltip.classList.contains(this.classes.visible)
            ) {
                this.toggle();
                this.selectedEmoji = null;
            }
            else { // Сброс последнего выбранного emoji
                this.selectedEmoji = null;
            }
        });
    }

    /**
     * Двигаемся по emojis с помощью клавиатуры
     * @param {string} arrowDirection - нажатая клавиша (направление движения)
     * @returns {void}
     */
    emojiTooltipNavigation(arrowDirection) {
        let id = null;

        if (this.selectedEmoji === null) {
            id = 0;
            this.selectedEmoji = 0;
        } else {
            id = this.selectedEmoji;
            
            switch (arrowDirection) {
                case "ArrowLeft":
                    id -= 1;
                    if (id < 0) id = 0;
                    break;

                case "ArrowRight":
                    id += 1;
                    break;

                case "ArrowUp":
                    id -= 10;
                    break;

                case "ArrowDown":
                    id += 10;
                    if (id < 0) id = 0;
                    break;

                default:
                    break;
            }
        }

        try {
            const selectedEmojiBtn = this.messenger.querySelector(`.emoji-tooltip__mainItem-list-item-wrapper[id='${id}']`);
            selectedEmojiBtn.focus();
            this.selectedEmoji = id;
        } catch {
        }
    }

    /**
     * Открываем/закрываем emoji tooltip
     * @returns {void}
     */
    toggle() {
        if (!this.canToggleEmojiTooltip) return;

        this.canToggleEmojiTooltip = false;

        if (!this.emojiTooltip.classList.contains(this.classes.visible)) {
            this.openEmojiTooltip();
        } else {
            this.closeEmojiTooltip();
        }
    }

    /**
     * Открываем emoji tooltip
     * @returns {void}
     */
    openEmojiTooltip() {
        this.emojiTooltip.classList.add(this.classes.visible);

        setTimeout(() => {
            this.emojiTooltip.classList.add(this.classes.active);
            this.canToggleEmojiTooltip = true;
        }, 33);
    }

    /**
     * Закрываем emoji tooltip
     * @returns {void}
     */
    closeEmojiTooltip() {
        this.emojiTooltip.classList.remove(this.classes.active);

        setTimeout(() => { // Задержка для плавного скрытия tooltip
            if (this.closeEmojiTooltip) {
                this.emojiTooltip.classList.remove(this.classes.visible);
                this.canToggleEmojiTooltip = true;
            }
        }, 200);
    }

    /**
     * Закрываем emoji tooltip при клике вне блока
     * @returns {void}
     */
    handleMilkClick(e) {
        if (
            e.target !== this.emojiTooltip
            && !this.emojiTooltip.contains(e.target)
            && this.emojiTooltip.classList.contains(this.classes.visible)
        ) {
            this.toggle();
        }
    }

    /**
     * Отправляем сообщение и изменяем внешний вид формы
     * @returns {void}
     */
    sendMessage() {
        const method = "get";
        const url = "data/POST_SEND_MESSAGE_SUCCESS.json";
        const message = this.textarea.value.trim();

        if (message) {
            this.MessageArea.sendMessage(method, url, message);
            this.textarea.value = "";
            this.textarea.style.height = "auto";
            this.messengerForm.style.height = "55px";
            this.textarea.style.overflow = "hidden";
            this.smile.style.right = "8px";
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const items = document.querySelectorAll(".js-message");
    for (let i = 0; i < items.length; i++) {
        new MessengerBottom(items[i]);
    }
});
