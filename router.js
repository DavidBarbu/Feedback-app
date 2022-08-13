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
const storage = require('node-sessionstorage')



// login user
router.post('/login', async (req, res) => {
    const authorization = req.headers.authorization;
    const body = req.body;

    const username = body.email;
    const password = body.password;

    console.log(body.email)
    console.log(body.password)
    
    let rez = await db.Student.findAll({
        where: {
            email: username,
        }
    });

    const id = rez[0].id.toString()

    if (rez.length === 0) {
        res.send("Nu a gasit datele in baza de date!")
    } else {

        try {
            if (username.toString() === rez[0].email.toString() && password.toString() === rez[0].password.toString()) {
                console.log("ie bune alea");
                const token = jwt.sign({ id }, SECRET_KEY);
                //let vrf = jwt.verify(token, SECRET_KEY)
                //console.log("id din token: ", vrf)
                 res.send({
                     token,
                 });

                // storage.setItem("id", vrf)
                // console.log('item set:', storage.getItem('id'))

            } else {
                res.send("Nu s bune")
            }

        } catch (e) {
            console.log("eroare in try")
            console.error(e)
        }
    }
});

// route for dashboard
router.get('/dashboard', authorizationMiddleware, (req, res) => {
    res.render('dashboard')
})

// route for logout
router.get('/logout', authorizationMiddleware, (req, res) => {
    res.render('base', { title: "Express", logout: "logout Successfully...!" })
})

// route for questionnaire
router.get('/chestionar', (req, res) => {
    res.render('chestionar')
})

router.post('/chestionar', (req, res) => {
    console.log("merge da");
    console.log("aici e req.body.email: ", req.body.user);
    res.send("da frt merge");
})

//cursuri
router.get("/cursuri", getAllCourses);
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