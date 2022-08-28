const express = require('express');
const path = require('path');
const bodyparser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const jwt = require('jsonwebtoken');

const router = require('./routes/router.js');

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json())
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }))
app.use(cookieParser());

app.set('view engine', 'ejs');
app.use('/static', express.static(path.join(__dirname, 'public')))
app.use('/assets', express.static(path.join(__dirname, 'public/assets')))
app.use('/route', router);

// home route
app.get('/', (req, res) =>{
    res.render('login');
})

app.listen(port, ()=>
    {
        console.log("S-a dășchis servăru' pă", port, "dă ce mă-ntrebi?")
    }
);