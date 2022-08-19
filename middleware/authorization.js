const jwt = require('jsonwebtoken'),
    { SECRET_KEY } = require('../config/jwt'),
    db = require('../models');


const authorizationMiddleware = (req, res, next) => {
    const token = req.cookies.access_token;
    //const authorization = req.headers['x-access-token'];
    //console.log("AUTH: ", authorization)
    console.log("TOKEN: ", token)
    if (token) {
        try {
            const decoded = jwt.verify(token.replace('Bearer ', ''), SECRET_KEY);
            console.log("token decodat: ", decoded);
            //req.userRole = data.role;
            //req.userId = data.id;
            next();
        } catch (e) {
            res.send({
                error: "invalid token!"
            });
        }
    }else{res.send("<h1>Nu aveti acces la aceasta pagina!</h1>");}
    
}

module.exports = authorizationMiddleware;