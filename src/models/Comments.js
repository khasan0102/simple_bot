const { fetch, fetchAll } = require("../lib/postgres");
const COMMENTS = `
    SELECT 
        u.username,
        u.phone_number,
        c.*
    FROM users_comments c
    INNER JOIN users u ON u.chat_id = c.chat_id
    WHERE 
        CASE 
            WHEN length($1) > 0 THEN u.chat_id = $1
        END
    ORDER BY c.created_at DESC
    OFFSET $2 ROWS FETCH FIRST $3 ROWS ONLY;
`;

const COMMENT = `
    SELECT 
        u.username,
        u.phone_number,
        c.*
    FROM users_comments c
    INNER JOIN users u ON u.chat_id = c.chat_id
    WHERE c.user_comment_id = $1
`;

const CREATE = `
    INSERT INTO users_comments(user_comment, chat_id)
    VALUES($1, $2)
    RETURNING *;
`;

const ALL_COUNT = `
    SELECT 
        COUNT(*)
    FROM users_comments c
    WHERE c.chat_id = $1;
`;

const DELETE = `
    DELETE FROM users_comments c
    WHERE c.user_comment_id = $1
    RETURNING *
`

const create = (comment , chat_id) =>  fetch(CREATE, comment, chat_id);
const getAll = (userId = "", page, count) => fetchAll(COMMENTS, userId, page, count);
const getOne = (commentId) => fetch(COMMENT, commentId);
const allCount = (userId) => fetch(ALL_COUNT, userId);
const deleteOne = (commentId) => fetch(DELETE, commentId)

module.exports = {
    create,
    getAll,
    getOne,
    allCount,
    deleteOne
};