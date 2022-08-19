var express = require("express");
var router = express.Router();
const { getAllCourses, getCourseById,
    getAllStudents, getStudentById, createStudent, updateStudent, deleteStudent,
    getAllProfessors, getProfessorById, createProfessor, updateProfessor, deleteProfessor,
} = require('./controllers/users');
const { sequelize } = require("./models");
const db = require("./models");
const authorizationMiddleware = require("./middleware/authorization")
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require("./config/jwt");
const bodyparser = require("body-parser");
const { localStorage } = require('node-localstorage')

// login user

router.post('/auth', async (req, res) => {
    //const authorization = req.headers['x-access-token'];
    const body = req.body;

    const email = body.email;
    const password = body.password;

    //console.log("authorization: ", authorization)
    console.log("body: ", body)
    console.log("username: ", email)
    console.log("password: ", password)

    let rez = await db.Student.findAll({ where: { email: email, } });
    //console.log("rez: ", rez)

    if (rez.length === 0) {
        res.json({ "Nu a gasit datele in baza de date!": "haha" })
    } else {
        const id = rez[0].id.toString()

        try {
            if (email.toString() === rez[0].email.toString() && password.toString() === rez[0].password.toString()) {
                console.log("User & password found in database!");
                const token = jwt.sign({ id }, SECRET_KEY);

                let vrf = jwt.verify(token, SECRET_KEY)

                console.log("Tokenul s-a generat si este urmatorul: ", token)
                res
                    .cookie("access_token", token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                    })
                    .status(200)
                    .json({ message: "Logged in successfully 😊 👌" });
            } else {
                res.json("Nu s bune")
            }

        } catch (e) {
            console.log("eroare in try")
            console.error(e)
        }
    }
});

router.get('/login', (req, res) => {
    res.render('login')
})

// route for dashboard
router.get('/dashboard', authorizationMiddleware, (req, res) => {
    console.log("a ajuns la renderul de la dashboard")
    res.render('dashboard')
})

// route for logout
router.get('/logout', authorizationMiddleware, (req, res) => {
    return res
        .clearCookie("access_token")
        .status(200)
        .render('login')
});

// route for questionnaire
router.get('/chestionar', authorizationMiddleware, async (req, res) => {
    let rez = await db.Professor.findAll();
    res.send(rez)
})

router.post('/chestionar/:id', (req, res) => {
    console.log("post chestionar");
    //console.log("aici e req.body.email: ", req.body.user);
    res.send("da frt merge");
    //res.render('chestionar')
})

//cursuri
router.get("/cursuri", authorizationMiddleware => {
    res.render('login', { title: "Express", logout: "logout Successfully...!" })
})
router.get("/curs/:id", getCourseById);

//studenti @s.unibuc.ro
router.get("/students", getAllStudents);
router.get("/student/:id", getStudentById);
router.post("/students", createStudent);
router.put("/student/:id", updateStudent);
router.delete("/student/:id", deleteStudent);

//profesori @unibuc.ro
router.get("/professors", getAllProfessors);
router.get("/professor/:id", getProfessorById);
router.post("/professors", createProfessor);
router.put("/professor/:id", updateProfessor);
router.delete("/professor/:id", deleteProfessor);

module.exports = router;