var express = require("express");
const xlsx = require('xlsx');
var router = express.Router();
const { getExcel, getFeedback, getStudents,
    // getAllCourses, getCourseById,
    // getAllStudents, getStudentById, createStudent, updateStudent, deleteStudent,
    // getAllProfessors, getProfessorById, createProfessor, updateProfessor, deleteProfessor,
} = require('./controllers/users');
const { sequelize } = require("./models");
const db = require("./models");
const authorizationMiddleware = require("./middleware/authorization")
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require("./config/jwt");
const bodyparser = require("body-parser");
const { localStorage } = require('node-localstorage')
var cookieParser = require('cookie-parser');
const workbookStudenti = xlsx.readFile('./files/Studenti.xlsx');
const workbookProfesori = xlsx.readFile('./files/Profesori.xlsx');
const bcrypt = require('bcrypt');
const saltRounds = 10;



//modificare parola
router.post('/modificareParola', authorizationMiddleware, async (req, res) => {
    let userType = req.body.userType
    //console.log("userType: " , userType)
    if (userType === 'student') {
        const profile = await db.Student.findByPk(req.body.userId)
        if (profile.password == req.body.parolaVeche) {
            if (req.body.parolaNoua1 == req.body.parolaNoua2) {
                bcrypt.hash(req.body.parolaNoua1, saltRounds, (err, hash) => {
                    if (err) {
                        console.log(err);
                    }
                    console.log("hash: ", hash)
                    db.Student.update({ password: hash }, { where: { id: req.body.userId } });
                    console.log("Successfully!")
                })
            } else
                console.log("Parolele noi nu coincid!")
        } else bcrypt.compare(req.body.parolaVeche, profile.password, (error, response) => {
            if (response) {
                if (req.body.parolaNoua1 == req.body.parolaNoua2) {
                    bcrypt.hash(req.body.parolaNoua1, saltRounds, (err, hash) => {
                        if (err) {
                            console.log(err);
                        }
                        console.log("hash: ", hash)
                        db.Student.update({ password: hash }, { where: { id: req.body.userId } });
                        console.log("Successfully!")
                    })
                } else
                    console.log("Parolele noi nu coincid!")
            }
            else console.log("Parola veche nu este buna!")
        })

    } else if (userType === 'profesor') {
        const profile = await db.Professor.findByPk(req.body.userId)
        if (profile.password == req.body.parolaVeche) {
            if (req.body.parolaNoua1 == req.body.parolaNoua2) {
                bcrypt.hash(req.body.parolaNoua1, saltRounds, (err, hash) => {
                    if (err) {
                        console.log(err);
                    }
                    console.log("hash: ", hash)
                    db.Professor.update({ password: hash }, { where: { id: req.body.userId } });
                    console.log("Successfully!")
                })
            } else
                console.log("Parolele noi nu coincid!")
        } else bcrypt.compare(req.body.parolaVeche, profile.password, (error, response) => {
            if (response) {
                if (req.body.parolaNoua1 == req.body.parolaNoua2) {
                    bcrypt.hash(req.body.parolaNoua1, saltRounds, (err, hash) => {
                        if (err) {
                            console.log(err);
                        }
                        console.log("hash: ", hash)
                        db.Professor.update({ password: hash }, { where: { id: req.body.userId } });
                        console.log("Successfully!")
                    })
                } else
                    console.log("Parolele noi nu coincid!")
            }
            else console.log("Parola veche nu este buna!")
        })
    } else if (userType === 'admin') {
        const profile = await db.Admin.findByPk(req.body.userId)
        if (profile.password == req.body.parolaVeche) {
            if (req.body.parolaNoua1 == req.body.parolaNoua2) {
                bcrypt.hash(req.body.parolaNoua1, saltRounds, (err, hash) => {
                    if (err) {
                        console.log(err);
                    }
                    console.log("hash: ", hash)
                    db.Admin.update({ password: hash }, { where: { id: req.body.userId } });
                    console.log("Successfully!")
                })
            } else
                console.log("Parolele noi nu coincid!")
        } else bcrypt.compare(req.body.parolaVeche, profile.password, (error, response) => {
            if (response) {
                if (req.body.parolaNoua1 == req.body.parolaNoua2) {
                    bcrypt.hash(req.body.parolaNoua1, saltRounds, (err, hash) => {
                        if (err) {
                            console.log(err);
                        }
                        console.log("hash: ", hash)
                        db.Admin.update({ password: hash }, { where: { id: req.body.userId } });
                        console.log("Successfully!")
                    })
                } else
                    console.log("Parolele noi nu coincid!")
            }
            else console.log("Parola veche nu este buna!")
        })
    } else if (userType === 'conducere') {
        const profile = await db.Admin.findByPk(req.body.userId)
        if (profile.password == req.body.parolaVeche) {
            if (req.body.parolaNoua1 == req.body.parolaNoua2) {
                bcrypt.hash(req.body.parolaNoua1, saltRounds, (err, hash) => {
                    if (err) {
                        console.log(err);
                    }
                    console.log("hash: ", hash)
                    db.Admin.update({ password: hash }, { where: { id: req.body.userId } });
                    console.log("Successfully!")
                })
            } else
                console.log("Parolele noi nu coincid!")
        } else bcrypt.compare(req.body.parolaVeche, profile.password, (error, response) => {
            if (response) {
                if (req.body.parolaNoua1 == req.body.parolaNoua2) {
                    bcrypt.hash(req.body.parolaNoua1, saltRounds, (err, hash) => {
                        if (err) {
                            console.log(err);
                        }
                        console.log("hash: ", hash)
                        db.Admin.update({ password: hash }, { where: { id: req.body.userId } });
                        console.log("Successfully!")
                    })
                } else
                    console.log("Parolele noi nu coincid!")
            }
            else console.log("Parola veche nu este buna!")
        })
    }
})

//import profesori
router.get('/importProfesori', authorizationMiddleware, async (req, res) => {
    const worksheet = workbookProfesori.Sheets[workbookProfesori.SheetNames[0]];
    try {
        let posts = [];
        let post = {};

        for (let cell in worksheet) {
            const cellAsString = cell.toString();

            if (cellAsString[1] !== 'r' && cellAsString[1] !== 'm' && cellAsString[1] > 1) {
                if (cellAsString[0] === 'A') {
                    post.id = worksheet[cell].v;
                }
                if (cellAsString[0] === 'B') {
                    post.firstName = worksheet[cell].v;
                }
                if (cellAsString[0] === 'C') {
                    post.lastName = worksheet[cell].v;
                }
                if (cellAsString[0] === 'D') {
                    post.email = worksheet[cell].v;
                }
                if (cellAsString[0] === 'E') {
                    post.password = worksheet[cell].v;
                }
                if (cellAsString[0] === 'F') {
                    post.userType = worksheet[cell].v;
                    posts.push(post);
                    post = {};
                }
            }
        }
        console.log("length: " + posts.length)
        for (var i = 0; i < posts.length; i++) {
            //console.log(posts[i].email)
            console.log("insert:", posts[i].id, posts[i].firstName,
                posts[i].lastName, posts[i].email, posts[i].password,
                posts[i].userType)
            await db.Professor.create({
                id: posts[i].id, firstName: posts[i].firstName,
                lastName: posts[i].lastName, email: posts[i].email, password: posts[i].password,
                userType: posts[i].userType
            })
        }

        res.json(posts)
    } catch (e) {
        res.send(e)
    }
})

//import studenti
router.get('/importStudenti', authorizationMiddleware, async (req, res) => {
    const worksheet = workbookStudenti.Sheets[workbookStudenti.SheetNames[0]];

    let posts = [];
    let post = {};

    for (let cell in worksheet) {
        const cellAsString = cell.toString();

        if (cellAsString[1] !== 'r' && cellAsString[1] !== 'm' && cellAsString[1] > 1) {
            if (cellAsString[0] === 'A') {
                post.id = worksheet[cell].v;
            }
            if (cellAsString[0] === 'B') {
                post.firstName = worksheet[cell].v;
            }
            if (cellAsString[0] === 'C') {
                post.lastName = worksheet[cell].v;
            }
            if (cellAsString[0] === 'D') {
                post.email = worksheet[cell].v;
            }
            if (cellAsString[0] === 'E') {
                post.password = worksheet[cell].v;
            }
            if (cellAsString[0] === 'F') {
                post.userType = worksheet[cell].v;
            }
            if (cellAsString[0] === 'G') {
                post.class = worksheet[cell].v;
            }
            if (cellAsString[0] === 'H') {
                post.year = worksheet[cell].v;
                posts.push(post);
                post = {};
            }
        }
    }
    console.log("length: " + posts.length)
    for (var i = 0; i < posts.length; i++) {
        //console.log(posts[i].email)
        await db.Student.create({
            id: posts[i].id, firstName: posts[i].firstName,
            lastName: posts[i].lastName, email: posts[i].email, password: posts[i].password,
            userType: posts[i].userType, class: posts[i].class, year: posts[i].year,
        })
    }
    res.json(posts)
})

//export excel
router.get('/export', authorizationMiddleware, getExcel)
router.get('/feedback', authorizationMiddleware, getFeedback)

// verify user
router.post('/verify', async (req, res) => {
    const body = req.body;
    const email = body.email;
    const password = body.password;
    let rez = await db.Student.findAll({ where: { email: email, } });
    console.log(rez)
    if (rez.length === 0) {
        let rez = await db.Professor.findAll({ where: { email: email, } });
        console.log(rez)
        if (rez.length === 0) {
            let rez = await db.Admin.findAll({ where: { email: email, } });
            console.log(rez)
            if (rez.length === 0) {
                res.send("Nu exista un cont cu acest email.")
            }
            console.log(rez)
            try {
                const id = rez[0].id.toString()
                const userType = rez[0].userType.toString()
                if (email.toString() === rez[0].email.toString() && password.toString() === rez[0].password.toString()) {
                    const token = jwt.sign({ id, userType }, SECRET_KEY);
                    res
                        .cookie("access_token", token, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === "production",
                        })
                        .status(200)
                        .json({ message: "Logged in successfully 😊 👌" });
                } else bcrypt.compare(password.toString(), rez[0].password.toString(), (error, response) => {
                    if (response) {
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
                })
            } catch (e) {
                console.error(e)
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
                } else bcrypt.compare(password.toString(), rez[0].password.toString(), (error, response) => {
                    if (response) {
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
                })
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
            } else bcrypt.compare(password.toString(), rez[0].password.toString(), (error, response) => {
                if (response) {
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
            })
        } catch (e) {
            console.error(e)
        }
    }
});

router.get('/dashboard', authorizationMiddleware, async (req, res) => {
    let userType = req.body.userType
    let student = await db.Student.findByPk(req.body.userId);
    const professor = await db.Professor.findByPk(req.body.userId);
    if (userType === "student") {
        res.render("studentDashboard", { body: student })
    } else if (userType === "profesor") {
        res.render("professorDashboard", { body: professor })
    } else if (userType === "admin") {
        res.render("adminDashboard", { body: student })
    } else if (userType === "conducere") {
        res.render("conducereDashboard", { body: student })
    } else { res.send("smth went wrong") }
})

// route for admin to edit
router.get('/db', authorizationMiddleware, async (req, res) => {
    let userType = req.body.userType
    let students = await db.Student.findAll()
    let professors = await db.Professor.findAll()
    if (userType === "admin") {
        res.render("db_view", { students: students, professors: professors })
    } else if (userType === "conducere") {
        res.render("db_edit", { students: students, professors: professors })
    } else {
        res.send("Nu sunteti admin!")
    }
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
//admin profile
router.get('/myAdminProfile', authorizationMiddleware, async (req, res) => {
    let userType = req.body.userType
    if (userType === "admin" || userType === "conducere") {
        profile = await db.Admin.findByPk(req.body.userId)
        res.render('myAdminProfile', { profile })
    }
    else {
        res.send("Nu sunteti admin!");
    }
})

router.get('/allFeedbacks', authorizationMiddleware, async (req, res) => {
    let userType = req.body.userType
    if (userType === "admin" || userType === "conducere") {
        allFeedbacks = await db.Feedback.findAll()
        allStudents = await db.Student.findAll()
        allProfessors = await db.Professor.findAll()
        allQuestions = await db.Question.findAll()
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


//profesori @unibuc.ro
router.get("/profesori/:id/:materie", authorizationMiddleware, async (req, res) => {
    let userType = req.body.userType
    let grupa = req.params.id
    let materie = req.params.materie
    if (userType === "student") {
        try {
            let profi = []
            let profesori = await db.Professor.findAll()
            for (let i = 0; i < profesori.length; i++) {
                //console.log(profesori[i]['dataValues']['materie_predata'], materie )
                if (profesori[i]['dataValues']['materie_predata'] == materie) {
                    console.log("aici unul:", profesori[i]['dataValues']['materie_predata'])
                    profi.push(profesori[i]['dataValues']['id'])
                }
            }
            console.log("profi:", profi, "materie: ", materie)
            res.render('profesori', { profi: profi, profesori: profesori, materie: materie });
        } catch (e) {
            res.send(e);
        }
    }
    else {
        res.send("<h1>Nu sunteti student!</h1>");
    }
});

//materii 
router.get("/materii", authorizationMiddleware, async (req, res) => {
    let userType = req.body.userType
    if (userType === "student") {
        let student = await db.Student.findByPk(req.body.userId)
        //console.log("stud:", student['dataValues']['class']);
        let materii = await db.Subject.findAll({ where: { grupa: student['dataValues']['class'], } });
        console.log("materii:", materii)
        let materii_grupa = []
        for (let i = 0; i < materii.length; i++) {
            let k = 1
            for (let j = 0; j < materii_grupa.length; j++) {
                console.log(materii[i]['dataValues']['grupa'], materii_grupa[j])
                if (materii[i]['dataValues']['nume_materie'] == materii_grupa[j]) {
                    console.log("sunt egale")
                    k = 0
                }
            }
            if (k == 1)
                materii_grupa.push(materii[i]['dataValues']['nume_materie'])
        }
        console.log(materii_grupa)
        res.render('materii', { materii: materii, materii_grupa: materii_grupa, student: student });
    }
    else {
        res.send("<h1>Nu sunteti student!</h1>");
    }
});

router.get("/deleteStudent/:id", authorizationMiddleware, async (req, res) => {
    let userType = req.body.userType
    const studentId = req.params.id;
    if (userType === "conducere") {
        const student = await db.Student.destroy({ where: { id: studentId } })
        const students = await db.Student.findAll()
        const professors = await db.Professor.findAll()
        res.render("db_edit", { students: students, professors: professors })
    } else res.send("<h1>Nu aveti acces!!</h1>");

})

router.get("/student/:id", authorizationMiddleware, async (req, res) => {
    let userType = req.body.userType
    const studentId = req.params.id;
    if (userType === "conducere") {
        const student = await db.Student.findByPk(studentId)
        res.render('editStudent', { body: student });
    } else res.send("<h1>Nu aveti acces!!</h1>");

})

router.get("/profesor/:id", authorizationMiddleware, async (req, res) => {
    let userType = req.body.userType
    const professorId = req.params.id;
    if (userType === "conducere") {
        const profesor = await db.Professor.findByPk(professorId)
        res.render('editProfessor', { body: profesor });
    } else res.send("<h1>Nu aveti acces!!</h1>");

})

router.get("/course/:id", authorizationMiddleware, async (req, res) => {
    let userType = req.body.userType
    const courseId = req.params.id;
    if (userType === "conducere") {
        const curs = await db.Subject.findByPk(courseId)
        res.render('editCourse', { body: curs });
        //res.send("<h1>Gata si editul</h1>");
    } else res.send("<h1>Nu aveti acces!!</h1>");
})

router.post("/editStudent/:id", authorizationMiddleware, async (req, res) => {
    let userType = req.body.userType
    const studentId = req.params.id;
    if (userType === "conducere") {
        db.Student.update({ firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email, class: req.body.class, year: req.body.year }, { where: { id: studentId } })
        const student = await db.Student.findByPk(studentId)
        res.render('editStudent', { body: student });
    } else res.send("<h1>Nu aveti acces!!</h1>");

})
router.post("/editProfessor/:id", authorizationMiddleware, async (req, res) => {
    let userType = req.body.userType
    const professorId = req.params.id;
    if (userType === "conducere") {
        db.Professor.update({ firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email }, { where: { id: professorId } })
        const profesor = await db.Professor.findByPk(professorId)
        res.render('editProfessor', { body: profesor });
        //res.send("<h1>Gata si editul</h1>");
    } else res.send("<h1>Nu aveti acces!!</h1>");
})

router.post("/editCourse/:id", authorizationMiddleware, async (req, res) => {
    let userType = req.body.userType
    const courseId = req.params.id;
    if (userType === "conducere") {
        db.Subject.update({ nume_materie: req.body.nume_materie, grupa: req.body.grupa, semestru: req.body.semestru, id_profesor: req.body.id_profesor }, { where: { id: courseId } })
        const curs = await db.Subject.findByPk(courseId)
        res.render('editCourse', { body: curs });
        //res.send("<h1>Gata si editul</h1>");
    } else res.send("<h1>Nu aveti acces!!</h1>");
})


router.get("/deleteProfessor/:id", authorizationMiddleware, async (req, res) => {
    let userType = req.body.userType
    const professorId = req.params.id;
    if (userType === "conducere") {
        const student = await db.Professor.destroy({ where: { id: professorId } })
        const students = await db.Student.findAll()
        const professors = await db.Professor.findAll()
        res.render("db_edit", { students: students, professors: professors })
    } else res.send("<h1>Nu aveti acces!!</h1>");

})


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

router.get("/courses", authorizationMiddleware, async (req, res) => {
    let userType = req.body.userType
    if (userType === "conducere") {
        const cursuri = await db.Subject.findAll()
        res.render('cursuri', { cursuri: cursuri });
    } else res.send("<h1>Nu aveti acces!!</h1>");
})

router.get("/questions", authorizationMiddleware, async (req, res) => {
    let userType = req.body.userType
    if (userType === "conducere") {
        const questions = await db.Question.findAll()
        res.render('questions', { questions: questions });
    } else res.send("<h1>Nu aveti acces!!</h1>");
})

router.post("/delete_question", authorizationMiddleware, async (req, res) => {
    let userType = req.body.userType
    if (userType === "conducere") {
        try {
            const qs = req.body.qs
            for (var i = 0; i < qs.length; i++) {
                const question = await db.Question.destroy({ where: { id: qs[i] } })
                const feedback = await db.Feedback.destroy({ where: { id_intrebare: qs[i] } })
            }
        } catch (error) {
            console.log('Error on updating user: ', error);
        }

    } else res.send("<h1>Nu aveti acces!!</h1>");
})

router.post("/questions", authorizationMiddleware, async (req, res) => {
    let userType = req.body.userType
    if (userType === "conducere") {
        try {
            await db.Question.create({ intrebare: req.body.inputu })
            console.log("INPUTU:", req.body.inputu)
            const feedbacks = await db.Feedback.findAll()
            const id_intrebare_adaugata = await db.Question.findOne({ where: { intrebare: req.body.inputu } })
            console.log("id adaugata:", id_intrebare_adaugata['dataValues']['id'])
            const id_intrebare = feedbacks[0]['dataValues']['id_intrebare']
            const fb = await db.Feedback.findAll({ where: { id_intrebare: id_intrebare, } })
            for (let i = 0; i < feedbacks.length; i++) {
                console.log("fb:", fb[i]['dataValues']['id_student'], fb[i]['dataValues']['id_profesor'])
                await db.Feedback.create({ id_student: fb[i]['dataValues']['id_student'], id_profesor: fb[i]['dataValues']['id_profesor'], id_intrebare: id_intrebare_adaugata['dataValues']['id'] })
            }

        } catch (error) {
            console.log('Error on updating user: ', error);
        }
        const questions = await db.Question.findAll()
        res.send({ questions })
    } else res.send("<h1>Nu aveti acces!!</h1>");
})

router.post("/chestionar/:id", authorizationMiddleware, async (req, res) => {
    const professorId = req.params.id;
    let userType = req.body.userType
    const DB = await db.Question.findAll()
    console.log("DB: ", DB.length)
    if (userType === "student") {
        try {
            let rez = null;
            for (let i = 0; i < req.body.inputu.length; i++) {
                console.log("INPUTU: ", req.body.inputu[i])
                rez = null;
                q = await db.Question.findAll()
                console.log("q aici: ", q[i]['dataValues']['id'])
                rez = await db.Feedback.findOne({
                    where: {
                        id_student: req.body.userId,
                        id_profesor: professorId,
                        id_intrebare: q[i]['dataValues']['id'],
                    }
                })

                if (rez) {
                    console.log("rez: ", rez)
                    await db.Feedback.update(
                        {
                            raspuns: req.body.inputu[i],
                        },
                        {
                            where:
                            {
                                id_student: req.body.userId,
                                id_profesor: professorId,
                                id_intrebare: q[i]['dataValues']['id'],
                            }
                        })
                } else {
                    await db.Feedback.create({
                        id_student: req.body.userId,
                        id_profesor: professorId,
                        id_intrebare: q[i]['dataValues']['id'],
                        raspuns: req.body.inputu[i]
                    })
                }
            }
        } catch (error) {
            console.log('Error on updating user: ', error);
        }
        let student = await db.Student.findByPk(req.body.userId)
        //console.log("stud:", student['dataValues']['class']);
        let materii = await db.Subject.findAll({ where: { grupa: student['dataValues']['class'], } });
        console.log("materii:", materii)
        let materii_grupa = []
        for (let i = 0; i < materii.length; i++) {
            let k = 1
            for (let j = 0; j < materii_grupa.length; j++) {
                console.log(materii[i]['dataValues']['grupa'], materii_grupa[j])
                if (materii[i]['dataValues']['nume_materie'] == materii_grupa[j]) {
                    console.log("sunt egale")
                    k = 0
                }
            }
            if (k == 1)
                materii_grupa.push(materii[i]['dataValues']['nume_materie'])
        }
        console.log(materii_grupa)
        res.render('materii', { materii: materii, materii_grupa: materii_grupa, student: student });
    } else if (userType === "profesor") {
        res.send("<h1>Nu sunteti student!</h1>");
    }
    else { res.send("smth went wrong") }
});

module.exports = router;