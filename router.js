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
router.get('/dashboard', authorizationMiddleware, async (req, res) => {
    console.log("req.body.id", req.body.userId)
    let rez = await db.Student.findByPk(req.body.userId);
    console.log("rezzzzzzz: ", rez)
    res.render('dashboard', { body: rez })
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
        res.json(profile)
    }
    else {
        res.send("Nu sunteti student!");
    }
})

//professor profile
router.get('/myProfessorProfile', authorizationMiddleware, async (req, res) => {
    let userType = req.body.userType
    if (userType === "profesor") {
        profile = await db.Student.findByPk(req.body.userId)
        res.json(profile)
    }
    else {
        res.send("Nu sunteti profesor!");
    }

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
router.get("/studenti", getAllStudents);
router.get("/student/:id", getStudentById);
router.post("/studenti", createStudent);
router.put("/student/:id", updateStudent);
router.delete("/student/:id", deleteStudent);

//profesori @unibuc.ro
router.get("/profesori", authorizationMiddleware, async (req, res) => {
    let userType = req.body.userType
    if (userType === "student") {
        let rez = await db.Professor.findAll();
        res.render('profesori', { body: (await rez) });
    }
    else {
        res.send("<h1>Nu sunteti student!</h1>");
    }
});


router.get("/profesor/:id", authorizationMiddleware, async (req, res) => {
    let rez = await db.Question.findAll();
    const professorId = req.params.id;
    let userType = req.body.userType
    if (userType === "student") {
        console.log("aci:", rez[0].intrebare)
        const professor = await db.Professor.findByPk(professorId);
        res.render("chestionar", { idProfessor: professor.id, firstNameProfessor: professor.firstName, lastNameProfessor: professor.lastName, Q: rez });
    } else if (userType === "profesor") {
        res.send("<h1>Nu sunteti student!</h1>");
    }
    else { res.send("smth went wrong") }
});

router.post("/profesor/:id", authorizationMiddleware, async (req, res) => {
    const professorId = req.params.id;
    console.log("id_profesor", professorId)
    let userType = req.body.userType
    console.log("input1 ", req.body.inputu)
    if (userType === "student") {
        try {
            await db.Feedback.update({
                Raspuns1: req.body.inputu[0],
                Raspuns2: req.body.inputu[1],
                Raspuns3: req.body.inputu[2],
            }, {
                where:
                {
                    id_student: req.body.userId,
                    id_profesor: professorId
                }
            });
        } catch (error) {
            console.log('Error on updating user: ', error);
        }
        // res.render("chestionar", {idProfessor: professor.id, firstNameProfessor: professor.firstName, lastNameProfessor: professor.lastName} );
        res.send("Successfully")
    } else if (userType === "profesor") {
        res.send("<h1>Nu sunteti student!</h1>");
    }
    else { res.send("smth went wrong") }
});

router.post("/profesori", createProfessor);
router.put("/profesor/:id", updateProfessor);
router.delete("/profesor/:id", deleteProfessor);

module.exports = router;