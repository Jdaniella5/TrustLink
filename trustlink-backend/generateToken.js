import jwt from "jsonwebtoken";

const generateToken = (user) => {
    return jwt.sign(process.env.JWT_SECRET, {
        expiresIn: "7d"
    });
};

module.exports = generateToken;