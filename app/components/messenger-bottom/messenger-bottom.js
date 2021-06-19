class MessengerBottom {
    constructor(el) {
        this.messenger = el;
        this.textarea = this.messenger.querySelector('.js-message-textarea');
        this.smile = this.messenger.querySelector('.js-message-smile');
        this.emojiTooltip = this.messenger.querySelector('.js-emoji-tooltip');

        this.setListeners();
    }

    /**
     * Слушаем событие input и динамически изменяем высоту textarea (max-height = 200px)
     */
    setListeners() {
        this.textarea.addEventListener('input', (e) => {
            let textarea = e.target;

            textarea.style.height = 'auto';

            let textareaHeight = textarea.scrollHeight + 2;

            if (textareaHeight < 200) {
                textarea.style.height = textareaHeight + "px";
                textarea.style.overflow = 'hidden';
                this.smile.style.right = '8px';
            } else {
                textarea.style.height = '200px';
                textarea.style.overflow = 'auto';
                this.smile.style.right = '22px';
            }
        })
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const items = document.querySelectorAll('.js-message');
    for (let i = 0; i < items.length; i++) {
        new MessengerBottom(items[i]);
    }
});
