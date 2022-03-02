module.exports = {
    phoneButton: {
        one_time_keyboard: true,
        resize_keyboard: true,
        keyboard: [
            [
                {
                    text: "Send Phone",
                    request_contact: true,
                },
            ],
        ],
    },

    menuButton: {
        resize_keyboard: true,
        keyboard: [
            [
                {
                    text: "CV jo'natish",
                },
                {
                    text: "Izoh bildirish",
                },
            ],
        ],
    },

    cvButton: {
        resize_keyboard: true,
        one_time_keyboard: true,
        keyboard: [
            [
                {
                    text: "PDF formatida",
                },
                {
                    text: "Text ko'rinishida",
                },
            ],
            [
                {
                    text: "⬅️ Orqaga",
                },
            ],
        ],
    },

    backButton: {
        resize_keyboard: true,
        keyboard: [
            [
                {
                    text: "⬅️ Orqaga",
                },
            ],
        ],
    },

    usersButtons: (users, page, allCount) => {
        const first = [];
        const second = [];

        for (let i in users) {
            if (i < 5) {
                first.push({
                    callback_data: `${users[i].chat_id}/users`,
                    text: `${+i + 1}`,
                });
            } else {
                second.push({
                    callback_data: `${users[i].chat_id}/users`,
                    text: `${+i + 1}`,
                });
            }
        }

        const leftData = page > 0 ? `${page - 1}/data` : "leftEnd";
        const rightData =
            page < Math.ceil(allCount / 10) - 1
                ? `${page + 1}/data`
                : "rightEnd";

        return [
            first,
            second,
            [
                {
                    text: "⬅️",
                    callback_data: leftData,
                },
                {
                    text: "❌",
                    callback_data: "delete",
                },
                {
                    text: "➡️",
                    callback_data: rightData,
                },
            ],
        ];
    },

    userButton: (userData) => {
        const topbutton = [];
        const buttons = [];
        if (userData.user_cv)
            topbutton.push({
                text: "CV PDF📕",
                callback_data: userData.chat_id + "/cvPDF",
            });
        if (userData.user_description)
            topbutton.push({
                text: "CV TEXT📑",
                callback_data: userData.chat_id + "/cvText",
            });

        if (userData.comment_count > 0) {
            topbutton.push({
                text: "Comments",
                callback_data: userData.chat_id + "/userComments",
            });
        }

        if (topbutton.length) buttons.push(topbutton);

        buttons.push([
            {
                text: `O'chirish`,
                callback_data: userData.chat_id + "/userDelete",
            },
            {
                text: "❌",
                callback_data: "delete",
            },
            {
                text: "Admin qilish",
                callback_data: userData.chat_id + "/userAdmin",
            },
        ]);

        return buttons;
    },

    commentsButtons: (comments, page, allCount) => {
        const first = [];
        const second = [];

        for (let i in comments) {
            if (i < 5) {
                first.push({
                    callback_data: `${comments[i].user_comment_id}/comment`,
                    text: `${+i + 1}`,
                });
            } else {
                second.push({
                    callback_data: `${comments[i].user_comment_id}/comment`,
                    text: `${+i + 1}`,
                });
            }
        }

        const leftData =
            page > 0 ? `${page - 1}/${comments[0].chat_id}/cData` : "leftEnd";
        const rightData =
            page < Math.ceil(allCount / 10) - 1
                ? `${page + 1}/${comments[0].chat_id}/cData`
                : "rightEnd";

        return [
            first,
            second,
            [
                {
                    text: "⬅️",
                    callback_data: leftData,
                },
                {
                    text: "❌",
                    callback_data: "delete",
                },
                {
                    text: "➡️",
                    callback_data: rightData,
                },
            ],
        ];
    },

    commentButton: (comment) => {
        return [
            [
                {
                    text: "❌",
                    callback_data: "delete",
                },
                {
                    text: "O'chirish",
                    callback_data: comment.user_comment_id + "/delComment",
                },
            ],
        ];
    },
};
