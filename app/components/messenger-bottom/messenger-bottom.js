class MessengerBottom {
    constructor(el) {
        this.messenger = el;
        this.textarea = this.messenger.querySelector(".js-message-textarea");
        this.smile = this.messenger.querySelector(".js-message-smile");

        this.borderWidth = 2;
        this.maxTeaxareaHeight = 200;

        this.setListeners();
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
                textarea.style.overflow = "hidden";
                this.smile.style.right = "8px";
            } else {
                textarea.style.height = "200px";
                textarea.style.overflow = "auto";
                this.smile.style.right = "22px";
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const items = document.querySelectorAll(".js-message");
    for (let i = 0; i < items.length; i++) {
        new MessengerBottom(items[i]);
    }
});
