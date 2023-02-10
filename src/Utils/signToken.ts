const jwt = require('jsonwebtoken');

export const signToken = (data) => {
    return jwt.sign(data, process.env.JWT_SECRET);
};
