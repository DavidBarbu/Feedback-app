const jwt = require('jsonwebtoken'),
    { SECRET_KEY } = require('../config/jwt'),
    db = require('../models');


const authorizationMiddleware = (req, res, next) => {
    const token = req.cookies.access_token;
    if (token) {
        try {
            const decoded = jwt.verify(token.replace('Bearer ', ''), SECRET_KEY);
            req.body.userId = decoded.id
            req.body.userType = decoded.userType
            next();
        } catch (e) {
            res.send({
                error: "invalid token!"
            });
        }
    }else{res.render('login', { txt:"Nu sunteti conectat!"})}
    
}

module.exports = authorizationMiddleware;