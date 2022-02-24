const { fetch, fetchAll } = require("../lib/postgres");
 
const GET_USER = `
    SELECT *
    FROM users
    WHERE chat_id = $1
`;


const ALL_COUNT = `
    SELECT 
        COUNT(u.chat_id)
    FROM users u
    WHERE u.phone_number IS NOT NULL
`;

const GET_USERS = `
    SELECT  u.username, 
            u.age,
            u.phone_number,
            CASE
                WHEN u.role = 1 THEN 'admin'
                ELSE 'user'
            END as role
    FROM users u
    WHERE u.phone_number IS NOT NULL
    ORDER BY u.role DESC
    OFFSET $1 ROWS FETCH FIRST $2 ROWS ONLY
`;

const CREATE_USER = `
    INSERT INTO users(chat_id)
    VALUES($1)
    RETURNING *
`;

const UPDATE_USER = `
    UPDATE users
    SET username = updateIFChanged($2, username),
    phone_number = updateIFChanged($3, phone_number),
    age = updateIFChanged($4, age),
    step = updateIFChanged($5, step),
    role = updateIFChanged($6, role),
    user_cv = updateIFChanged($7, user_cv),
    user_description = updateIFChanged($8, user_description)
    WHERE chat_id = $1
    RETURNING *
`;

const DELETE_USER = `
    DELETE FROM users 
    WHERE chat_id = $1
    RETURNING *
`;

const getOne = (chatId) => fetch(GET_USER, chatId);
const getAll = (page = 1, count = 1000) => fetchAll(GET_USERS, page, count);
const allCount = () => fetch(ALL_COUNT);
const create = (chatId) =>  fetch(CREATE_USER, chatId);
const updateOne = (chatId, username, phoneNumber, age, step, role, user_cv = null, user_desc = null) => fetch(
    UPDATE_USER,
    chatId, username,
    phoneNumber, age,
    step, role, user_cv,
    user_desc
);

const deleteOne = (chatId) => fetch(DELETE_USER, chatId);

module.exports = {
    getAll,
    getOne,
    create,
    updateOne,
    deleteOne,
    allCount
};