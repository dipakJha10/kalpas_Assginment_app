const constants = require('../util/constants');
const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const users = [
    {
        name: "ABC@yxz.com",
        password: "12345"
    },
    {
        name: "XYZ@xyz.com",
        password: "12345"
    },
    {
        name: "pqrs@xyz.com",
        password: "12345"
    }
];

const secretKey = "2342423525222jhfkhilfyowiiwfwojowfjjoiwiow";

const verifyUser = (username, password) => {
    let userIndex = users.findIndex((x) => x.name === username);
    if (userIndex !== -1) {
        if (users[userIndex].password === password) {
            return {
                authentication: true,
                message: constants.AUTHORIZATION_SUCCESS_MESSAGE,
                user: { user: users[userIndex].name }
            }
        } else {
            return {
                authentication: false,
                message: constants.PASSWORD_MISMATCH
            }
        }
    } else {
        return {
            authentication: false,
            message: constants.USER_NOT_EXISTS
        };
    }
}


function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.status(403).send({ status: httpStatus.FORBIDDEN, message: "Access Denied" });
    }

}

module.exports = {
    verifyUser,
    secretKey,
    verifyToken
}