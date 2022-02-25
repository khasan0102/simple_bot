const { fetch } = require("../lib/postgres");
const COMMENT = `
    SELECT 
        u.username,
        u.phone_number,
        c.*
    FROM users_comments c
    INNER JOIN users u ON u.chat_id = c.chat_id
    WHERE 
        CASE 
            WHEN length($1) > 0 THEN u.chat_id = $1
        END;
`;

const CREATE = `
    INSERT INTO users_comments(user_comment, chat_id)
    VALUES($1, $2)
    RETURNING *;
`;

const create = (comment , chat_id) =>  fetch(CREATE, comment, chat_id);
module.exports = {
    create
}