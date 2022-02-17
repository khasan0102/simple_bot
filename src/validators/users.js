const Joi = require("joi");

const usersValidation = new Joi.object({
    username: Joi.string().min(3).max(32).pattern(/^[a-zA-Z_ ]*$/),
    age: Joi.number().min(8).max(60),
});


const user = (payload) => {
    const { error } = usersValidation.validate(payload);

    if(error) 
        return false;
    
    return true;
}

module.exports = {
    user
}