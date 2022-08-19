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
var cookieParser = require('cookie-parser');


// verify user
router.post('/verify', async (req, res) => {
    const body = req.body;
    const email = body.email;
    const password = body.password;
    console.log("Username: ", email, ", Password: ", password)
    let rez = await db.Student.findAll({ where: { email: email, } });
    console.log("rez: ", rez.length)
    if (rez.length === 0) {
        let rez = await db.Professor.findAll({ where: { email: email, } });
        if (rez.length === 0) {
            res.send("Nu exista un cont cu acest email.");
        } else {
            const id = rez[0].id.toString()
            const userType = rez[0].userType.toString()
            console.log("id: ", id, ", userType: ", userType)
            try {
                if (email.toString() === rez[0].email.toString() && password.toString() === rez[0].password.toString()) {
                    const token = jwt.sign({ id, userType }, SECRET_KEY);
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
    } else {
        const id = rez[0].id.toString()
        const userType = rez[0].userType.toString()
        console.log("id: ", id, ", userType: ", userType)
        try {
            if (email.toString() === rez[0].email.toString() && password.toString() === rez[0].password.toString()) {
                const token = jwt.sign({ id, userType }, SECRET_KEY);
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

// route for login
router.get('/login', (req, res) => {
    res.render('login')
})

// route for dashboard
router.get('/dashboard', authorizationMiddleware, (req, res) => {
    res.render('dashboard')
})

// route for logout
router.get('/logout', (req, res) => {
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

//student profile
router.get('/myStudentProfile', authorizationMiddleware, async (req, res) => {
    let userType = req.body.userType
    if (userType === "student") {
        profile = await db.Student.findByPk(req.body.userId)
    }
    else {
        res.send({ error: "Student account not found!" });
    }
    res.json(profile)
})

//professor profile
router.get('/myProfessorProfile', authorizationMiddleware, async (req, res) => {
    let userType = req.body.userType
    if (userType === "profesor") {
        profile = await db.Student.findByPk(req.body.userId)
    }
    else {
        res.send({ error: "Professor account not found!" });
    }
    res.json(profile)
})

router.get('/chestionar/:id', authorizationMiddleware, (req, res) => {
    res.render('chestionar')
})
router.post('/chestionar/:id', authorizationMiddleware, (req, res) => {
    res.render('chestionar')
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