import axios from 'axios';

export default class MessageArea {
    constructor() {
        this.messageArea = document.querySelector(".js-message-area");
        this.messageArea.MessageArea = this;

        this.setListeners();
    }

    setListeners() {
        this.messageArea.addEventListener('submit', e => {
            e.preventDefault();
        });
    }

    /**
     * AJAX запрос для добавления сообщения (get, а не post, т.к. нет backend)
     * @param {string} method
     * @param {string} url
     * @param {string} data
     * @returns {string}
     */
    sendMessage(method, url, data) {
        axios({
            method: method || "get",
            url
        })
            .then((response) => {
                const receivedData = response.data;
                switch (receivedData.status) {
                    case "POST_SEND_MESSAGE_SUCCESS":
                        this.messageArea.innerHTML += MessageArea.addMessage(data);
                        break;
                    case "POST_SEND_MESSAGE_FAIL":
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
     * Создадим html-строку нового сообщения
     * @param {string} data - данные из AJAX-запроса
     * @returns {string}
     */
    static addMessage(data) {
        let dataList = data.split('');

        dataList.forEach((el, idx) => {
            if (el === "\n") {
                dataList[idx] = "<br>"
            }
        });

        const newData = dataList.join('');
        const result = `<span class="main__message-area-item">${newData}</span>`;

        return result;
    }
}
