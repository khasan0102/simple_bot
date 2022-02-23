const { fetch, fetchAll } = require("../lib/postgres");
 
const GET_USER = `
    SELECT *
    FROM users
    WHERE chat_id = $1
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
    ORDER BY u.role DESC
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
    user_cv = updateIFChanged($7, user_cv)
    WHERE chat_id = $1
    RETURNING *
`;

const DELETE_USER = `
    DELETE FROM users 
    WHERE chat_id = $1
    RETURNING *
`;

const getOne = (chatId) => fetch(GET_USER, chatId);
const getAll = () => fetchAll(GET_USERS);
const create = (chatId) =>  fetch(CREATE_USER, chatId);
const updateOne = (chatId, username, phoneNumber, age, step, role, user_cv = null) => fetch(
    UPDATE_USER,
    chatId, username,
    phoneNumber, age,
    step, role, user_cv
);
const deleteOne = (chatId) => fetch(DELETE_USER, chatId);

module.exports = {
    getAll,
    getOne,
    create,
    updateOne,
    deleteOne
};