const jwt = require('jsonwebtoken'),
    { SECRET_KEY } = require('../config/jwt'),
    db = require('../models');


const authorizationMiddleware = (req, res, next) => {
    const token = req.cookies.access_token;
    console.log("TOKEN: ", token)
    if (token) {
        try {
            const decoded = jwt.verify(token.replace('Bearer ', ''), SECRET_KEY);
            console.log("token decodat: ", decoded);
            req.body.userId = decoded.id
            req.body.userType = decoded.userType
            console.log("id_student:", req.body.userId)
            console.log("userType: ", decoded.userType)
            next();
        } catch (e) {
            res.send({
                error: "invalid token!"
            });
        }
    }else{res.render('login', { txt:"Date invalide!"})}
    
}

module.exports = authorizationMiddleware;