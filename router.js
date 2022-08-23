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
//const { QueryInterface } = require("sequelize/types");
//let alert = require('alert'); 

// verify user
router.post('/verify', async (req, res) => {
    const body = req.body;
    const email = body.email;
    const password = body.password;
    let rez = await db.Student.findAll({ where: { email: email, } });
    if (rez.length === 0) {
        let rez = await db.Professor.findAll({ where: { email: email, } });
        if (rez.length === 0) {
            res.send("Nu exista un cont cu acest email.")
        } else {
            const id = rez[0].id.toString()
            const userType = rez[0].userType.toString()
            try {
                if (email.toString() === rez[0].email.toString() && password.toString() === rez[0].password.toString()) {
                    const token = jwt.sign({ id, userType }, SECRET_KEY);
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
                console.error(e)
            }
        }
    } else {
        const id = rez[0].id.toString()
        const userType = rez[0].userType.toString()
        try {
            if (email.toString() === rez[0].email.toString() && password.toString() === rez[0].password.toString()) {
                const token = jwt.sign({ id, userType }, SECRET_KEY);
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
            console.error(e)
        }
    }
});

// route for login
// router.get('/login', (req, res) => {
//     res.render('login')
// })

// route for dashboard
router.get('/dashboard', authorizationMiddleware, async (req, res) => {
    let userType = req.body.userType
    let rez = await db.Student.findByPk(req.body.userId);
    //console.log("req.body.id", req.body.userId)
    //const professor = await db.Professor.findByPk(professorId);
    if (userType === "student") {
        res.render("studentDashboard", { body: rez })
    } else if (userType === "profesor") {
        res.render("professorDashboard", { body: rez })
    } else if (userType === "admin") {
        res.render("adminDashboard", { body: rez })
    } else { res.send("smth went wrong") }
})

// route for admin to edit
router.get('/db', authorizationMiddleware, async (req, res) => {
    let userType = req.body.userType
    let students = await db.Student.findAll()
    let professors = await db.Professor.findAll()
    if (userType === "admin") {
        res.render("db", { students: students, professors: professors })
    } else { res.send("Nu sunteti admin!") }
})

// route for logout
router.get('/logout', (req, res) => {
    //queryInterface.removeColumn('Questions','da')
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
        res.render('myStudentProfile', { profile })
    } else {
        res.send("Nu sunteti student!");
    }
})

//professor profile
router.get('/myProfessorProfile', authorizationMiddleware, async (req, res) => {
    let userType = req.body.userType
    if (userType === "profesor") {
        profile = await db.Professor.findByPk(req.body.userId)
        res.render('myProfessorProfile', { profile })
    }
    else {
        res.send("Nu sunteti profesor!");
    }
})

router.get('/allFeedbacks', authorizationMiddleware, async (req, res) => {
    let userType = req.body.userType
    if (userType === "admin") {
        allFeedbacks = await db.Feedback.findAll()
        allStudents = await db.Student.findAll()
        allProfessors = await db.Student.findAll()
        allQuestions = await db.Question.findAll()
        console.log("a ajuns aici", allFeedbacks)
        //res.json(allFeedbacks)
        res.render('allFeedbacks', { allFeedbacks, allStudents, allProfessors, allQuestions })
    }
    else {
        res.send("Nu sunteti admin!");
    }
})

//professor profile
router.get('/professorFeedbacks', authorizationMiddleware, async (req, res) => {
    let q = await db.Question.findAll();
    let userType = req.body.userType
    if (userType === "profesor") {
        myFeedback = await db.Feedback.findAll({ where: { id_profesor: req.body.userId } })
        res.render('professorFeedbacks', { fb: myFeedback, Q: q })
    }
    else {
        res.send("Nu sunteti profesor!");
    }
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


router.get("/chestionar/:id", authorizationMiddleware, async (req, res) => {
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

router.post("/chestionar/:id", authorizationMiddleware, async (req, res) => {
    const professorId = req.params.id;
    let userType = req.body.userType
    console.log("req.body", req.body.inputu.length)
    if (userType === "student") {
        try {
            let rez = await db.Feedback.findOne({
                where: {
                    id_student: req.body.userId,
                    id_profesor: professorId
                }
            })
            console.log("rezFeedback", rez)
            if (rez) {
                let updateObject = {}
                for (let i = 0; i < req.body.inputu.length; i++) {
                    updateObject["Raspuns" + (i + 1)] = req.body.inputu[i];
                }
                await db.Feedback.update(
                    updateObject,
                    {
                        where:
                        {
                            id_student: req.body.userId,
                            id_profesor: professorId
                        }
                    })

            } else {
                await db.Feedback.create(updateObject)
            }
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

module.exports = router;