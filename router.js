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
router.post('/login', async (req, res) => {
    const authorization = req.headers.authorization;
    const body = req.body;


    //localStorage.setItem("a:", "storage aici asa frumos")
    const person = {
        name: "Obaseki Nosa",
        location: "Lagos",
    }
    
    window.localStorage.setItem('user', JSON.stringify(person));



    const email = body.email;
    const password = body.password;

    console.log("authorization: ", authorization)
    console.log("body: ", body)

    console.log("username: ", email)
    console.log("password: ", password)

    console.log(body.email)
    console.log(body.password)
    
    let rez = await db.Student.findAll({ where: { email: email, } });

    if (rez.length === 0) {
        res.send("Nu a gasit datele in baza de date!")
    } else {
        const id = rez[0].id.toString()

        try {
            if (email.toString() === rez[0].email.toString() && password.toString() === rez[0].password.toString()) {
                console.log("User & password found in database!") ;
                const token = jwt.sign({ id }, SECRET_KEY);

                let vrf = jwt.verify(token, SECRET_KEY)

                //storage.setItem("id", vrf.id)


                console.log("Token: ", token)
                //res.send({
                //    token,
                //});
                res.json({"Token": vrf})
                //res.render("dashboard");

                //console.log("x access token: ", req.headers['authorization'])
                console.log('ID user din token:', storage.getItem('id'))

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
router.get('/dashboard', (req, res) => {
    res.render('dashboard')
})

// route for logout
router.get('/logout', authorizationMiddleware, (req, res) => {
    res.render('base', { title: "Express", logout: "logout Successfully...!" })
})

// route for questionnaire
router.get('/chestionar', async (req, res) => {
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