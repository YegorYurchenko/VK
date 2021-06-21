import MessageArea from '../main/main';

class MessengerBottom {
    constructor(el) {
        this.messenger = el;
        this.messengerForm = this.messenger.querySelector(".js-message-form");
        this.messengerFormEnter = this.messenger.querySelector(".js-message-form-enter");
        
        this.textarea = this.messenger.querySelector(".js-message-textarea");
        this.smile = this.messenger.querySelector(".js-message-smile");

        this.borderWidth = 2;
        this.formDifference = 18;
        this.maxTeaxareaHeight = 200;

        this.init();
        this.setListeners();
    }

    /**
     * Отправка сообщения
     * @returns {void}
     */
    init() {
        this.MessageArea = new MessageArea();
    }

    /**
     * Слушаем событие input и динамически изменяем высоту textarea
     * @returns {void}
     */
    setListeners() {
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

        this.messengerFormEnter.addEventListener('click', e => {
            this.sendMessage();
        });

        this.textarea.addEventListener("keydown", e => {
            if (e.ctrlKey && e.keyCode == 13) {
                this.sendMessage(e);
            }
        })
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
