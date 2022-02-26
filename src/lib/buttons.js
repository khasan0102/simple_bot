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

        for (let i in users) {
            if (i < 5) {
                first.push({
                    callback_data: `${users[i].chat_id}/users`,
                    text: `${+i + 1}`
                })
            } else {
                second.push({
                    callback_data: `${users[i].chat_id}/users`,
                    text: `${+i + 1}`
                })
            }
        };

        const leftData = page > 0 ? `${page - 1}/data` : 'leftEnd';
        const rightData = page < Math.ceil(allCount / 10) - 1 ? `${page + 1}/data` : 'rightEnd'

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
    },

    userButton: (user) => {
        const topbutton = [];
        const buttons = [];
        if (user.user_cv)
            topbutton.push({
                text: "CV PDF📕",
                callback_data: user.user_cv + "/cvpdf"
            });
        if (user.user_description)
            topbutton.push({
                text: "CV TEXT📑",
                callback_data: user.user_id + "/description"
            });

        if (topbutton.length)
            buttons.push(topbutton);

        buttons.push([
            {
                text: `O'chirish`,
                callback_data: user.user_id + "/userDelete"
            },
            {
                text: "❌",
                callback_data: "delete"
            },
            {
                text: "Admin qilish",
                callback_data: user.user_id + "/userAdmin"
            }
        ]);

        return buttons;
    }
}

