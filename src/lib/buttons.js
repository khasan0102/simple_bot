module.exports = {
    phoneButton: {
        one_time_keyboard: true,
        resize_keyboard: true,
        keyboard: [
            [{
                text: "Send Phone",
                request_contact: true
            }]
        ]
    },

    menuButton: {
        resize_keyboard: true,
        keyboard: [
            [
                {
                    text: "CV jo'natish"
                },
                {
                    text: "Izoh bildirish"
                }
            ]
        ]
    },

    cvButton: {
        resize_keyboard: true,
        one_time_keyboard: true,
        keyboard: [
            [
                {
                    text: "PDF formatida"
                },
                {
                    text: "Text ko'rinishida"
                }
            ],
            [
                {
                    text: "⬅️ Orqaga"
                }
            ]
        ]
    },

    backButton: {
        resize_keyboard: true,
        keyboard: [
            [{
                text: "⬅️ Orqaga"
            }]
        ]
    },

    usersButtons: (users, page, allCount) => {
        const first = [];
        const second = [];

        for(let i in users) {
            if(i < 5) {
                first.push({
                    callback_data: `${users[i].chat_id}/user`,
                    text: `${i + 1}`
                })
            }else {
                second.push({
                    callback_data: `${users[i].chat_id}/user`,
                    text: `${+i + 1}`
                })
            }
        };

        const leftData = page !== 1 ? `${page - 1}/leftData` : 'leftEnd';
        const rightData = page > Math.ceil(allCount / 10) ? `${page + 1}/rightData` : 'rightEnd'

        return [
            first,
            second,
            [
                {
                    text: "⬅️",
                    callback_data: leftData
                },
                {
                    text: "❌",
                    callback_data: "delete"
                },
                {
                    text: "➡️",
                    callback_data: rightData
                }
            ]
        ]
    }
}

