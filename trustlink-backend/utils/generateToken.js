import jwt from "jsonwebtoken";

const generateToken = (user, sessionId) => {
    return jwt.sign( {user, sessionId }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });
};

module.exports = generateToken;