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
}