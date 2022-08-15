const jwt = require('jsonwebtoken'),
    { SECRET_KEY } = require('../config/jwt'),
    db = require('../models');


const authorizationMiddleware = (req, res, next) => {
    const authorization = req.headers.authorization;
    console.log("AUTH: ", authorization)
    if (authorization) {
        try {
            const decoded = jwt.verify(authorization.replace('Bearer ', ''), SECRET_KEY);
            console.log("token decodat: ", decoded);
            next();
        } catch (e) {
            res.send({
                error: "invalid token!"
            });
        }
    }else{res.send("<h1>Nu aveti acces la aceasta pagina!</h1>");}
    
}

module.exports = authorizationMiddleware;