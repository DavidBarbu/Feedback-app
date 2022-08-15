const express = require('express');
const path = require('path');
const bodyparser = require("body-parser");
const session = require("express-session");
const { v4: uuidv4 } = require("uuid");
const jwt = require('jsonwebtoken');

const router = require('./router');

const app = express();

const port = process.env.PORT || 3000;


app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }))

app.set('view engine', 'ejs');

app.use('/route', router);

// home route
app.get('/', (req, res) =>{
    res.render('base', { title : "Login System"});
})


app.listen(port, ()=>
    {
        console.log("S-a dășchis servăru' pă", port, "dă ce mă-ntrebi?")
    }
);