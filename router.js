var express = require("express");
const xlsx = require('xlsx');
var router = express.Router();
const { getExcel, getFeedback, getStudents } = require('./controllers/users');
const { sequelize } = require("./models");
const db = require("./models");
const authorizationMiddleware = require("./middleware/authorization")
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require("./config/jwt");
const bodyparser = require("body-parser");
const { localStorage } = require('node-localstorage')
var cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const excelJS = require("exceljs");

//import profesori
router.get('/importProfesori', async (req, res) => {
    var workbook = new excelJS.Workbook();
    workbook.xlsx.readFile('./files/Import.xlsx')
        .then(function () {
            var worksheet = workbook.getWorksheet('Lista Profesori')
            worksheet.eachRow({ includeEmpty: false }, async function (row, rowNumber) {
                try {
                    await db.Professor.create({ id: parseInt(row.values[1]), firstName: String(row.values[2]), lastName: String(row.values[3]), email: String(row.values[4]), password: String(row.values[5]), userType: String(row.values[6]), createdAt: new Date(), updatedAt: new Date() })
                } catch (e) { console.error(e) }
            });
        });
    setTimeout(async function () {
        const last = await db.Professor.findAll();
        const ll = last.length - 1
        await db.Professor.destroy({ where: { id: last[ll]['dataValues']['id'] } })
    }, 10000)
    res.send("Gata frt")
})

//import admini
router.get('/importAdmini', async (req, res) => {
    var workbook = new excelJS.Workbook();
    workbook.xlsx.readFile('./files/Import.xlsx')
        .then(function () {
            var worksheet = workbook.getWorksheet('Lista Admini')
            worksheet.eachRow({ includeEmpty: false }, async function (row, rowNumber) {
                try {
                    await db.Admin.create({ id: parseInt(row.values[1]), email: String(row.values[2]), password: String(row.values[3]), userType: String(row.values[4]), createdAt: new Date(), updatedAt: new Date() })
                } catch (e) { console.error(e) }
            });
        });
    setTimeout(async function () {
        const last = await db.Admin.findAll();
        const ll = last.length - 1
        await db.Admin.destroy({ where: { id: last[ll]['dataValues']['id'] } })
    }, 10000)

    res.send("Gata frt")
})

//import plan
router.get('/importPlan', async (req, res) => {
    var workbook = new excelJS.Workbook();
    workbook.xlsx.readFile('./files/Import.xlsx')
        .then(function () {
            var worksheet = workbook.getWorksheet('Lista Materii')
            worksheet.eachRow({ includeEmpty: false }, async function (row, rowNumber) {
                try {
                    await db.Subject.create({ id: parseInt(row.values[1]), nume_materie: String(row.values[2]), grupa: parseInt(row.values[3]), semestru: parseInt(row.values[4]), id_profesor: parseInt(row.values[5]), createdAt: new Date(), updatedAt: new Date() })
                } catch (e) { console.error(e) }
            });
        });
    setTimeout(async function () {
        const last = await db.Subject.findAll();
        const ll = last.length - 1
        await db.Subject.destroy({ where: { id: last[ll]['dataValues']['id'] } })
    }, 10000)
    res.send("Gata frt")
})

//import intrebari
router.get('/importIntrebari', async (req, res) => {
    var workbook = new excelJS.Workbook();
    workbook.xlsx.readFile('./files/Import.xlsx')
        .then(function () {
            var worksheet = workbook.getWorksheet('Lista Intrebari')
            worksheet.eachRow({ includeEmpty: false }, async function (row, rowNumber) {
                try {
                    await db.Question.create({ id: parseInt(row.values[1]), intrebare: String(row.values[2]), createdAt: new Date(), updatedAt: new Date() })
                } catch (e) { console.error(e) }
            });
        });
    setTimeout(async function () {
        const last = await db.Question.findAll();
        const ll = last.length - 1
        await db.Question.destroy({ where: { id: last[ll]['dataValues']['id'] } })
    }, 10000)
    res.send("Gata frt")
})

//import studenti
router.get('/importStudenti', async (req, res) => {
    var workbook = new excelJS.Workbook();
    workbook.xlsx.readFile('./files/Import.xlsx')
        .then(function () {
            var worksheet = workbook.getWorksheet('Lista Studenti');

            worksheet.eachRow({ includeEmpty: false }, async function (row, rowNumber) {
                try {
                    await db.Student.create({ id: parseInt(row.values[1]), firstName: String(row.values[2]), lastName: String(row.values[3]), email: String(row.values[4]), password: String(row.values[5]), userType: String(row.values[6]), class: parseInt(row.values[7]), year: parseInt(row.values[8]), createdAt: new Date(), updatedAt: new Date() })
                } catch (e) { console.error(e) }
            });
        });
    setTimeout(async function () {
        const last = await db.Student.findAll();
        const ll = last.length - 1
        await db.Student.destroy({ where: { id: last[ll]['dataValues']['id'] } })
    }, 10000)
    res.send("Da frate")
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
    if (rez.length === 0) {
        let rez = await db.Professor.findAll({ where: { email: email, } });
        if (rez.length === 0) {
            let rez = await db.Admin.findAll({ where: { email: email, } });
            if (rez.length === 0) {
                res.send("Nu exista un cont cu acest email.")
            }
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

//modificare parola
router.post('/modificareParola', authorizationMiddleware, async (req, res) => {
    let userType = req.body.userType
    if (userType === 'student') {
        const profile = await db.Student.findByPk(req.body.userId)
        if (profile.password == req.body.parolaVeche) {
            if (req.body.parolaNoua1 == req.body.parolaNoua2) {
                bcrypt.hash(req.body.parolaNoua1, saltRounds, (err, hash) => {
                    if (err) {
                        console.error(err);
                    }
                    db.Student.update({ password: hash }, { where: { id: req.body.userId } });
                })
            } else
                console.error("Parolele noi nu coincid!")
        } else bcrypt.compare(req.body.parolaVeche, profile.password, (error, response) => {
            if (response) {
                if (req.body.parolaNoua1 == req.body.parolaNoua2) {
                    bcrypt.hash(req.body.parolaNoua1, saltRounds, (err, hash) => {
                        if (err) {
                            console.error(err);
                        }
                        db.Student.update({ password: hash }, { where: { id: req.body.userId } });
                    })
                } else
                    console.error("Parolele noi nu coincid!")
            }
            else console.error("Parola veche nu este buna!")
        })

    } else if (userType === 'profesor') {
        const profile = await db.Professor.findByPk(req.body.userId)
        if (profile.password == req.body.parolaVeche) {
            if (req.body.parolaNoua1 == req.body.parolaNoua2) {
                bcrypt.hash(req.body.parolaNoua1, saltRounds, (err, hash) => {
                    if (err) {
                        console.error(err);
                    }
                    db.Professor.update({ password: hash }, { where: { id: req.body.userId } });
                })
            } else
                console.error("Parolele noi nu coincid!")
        } else bcrypt.compare(req.body.parolaVeche, profile.password, (error, response) => {
            if (response) {
                if (req.body.parolaNoua1 == req.body.parolaNoua2) {
                    bcrypt.hash(req.body.parolaNoua1, saltRounds, (err, hash) => {
                        if (err) {
                            console.error(err);
                        }
                        db.Professor.update({ password: hash }, { where: { id: req.body.userId } });
                    })
                } else
                    console.error("Parolele noi nu coincid!")
            }
            else console.error("Parola veche nu este buna!")
        })
    } else if (userType === 'admin') {
        const profile = await db.Admin.findByPk(req.body.userId)
        if (profile.password == req.body.parolaVeche) {
            if (req.body.parolaNoua1 == req.body.parolaNoua2) {
                bcrypt.hash(req.body.parolaNoua1, saltRounds, (err, hash) => {
                    if (err) {
                        console.error(err);
                    }
                    db.Admin.update({ password: hash }, { where: { id: req.body.userId } });
                })
            } else
                console.error("Parolele noi nu coincid!")
        } else bcrypt.compare(req.body.parolaVeche, profile.password, (error, response) => {
            if (response) {
                if (req.body.parolaNoua1 == req.body.parolaNoua2) {
                    bcrypt.hash(req.body.parolaNoua1, saltRounds, (err, hash) => {
                        if (err) {
                            console.error(err);
                        }
                        db.Admin.update({ password: hash }, { where: { id: req.body.userId } });
                    })
                } else
                    console.error("Parolele noi nu coincid!")
            }
            else console.error("Parola veche nu este buna!")
        })
    } else if (userType === 'conducere') {
        const profile = await db.Admin.findByPk(req.body.userId)
        if (profile.password == req.body.parolaVeche) {
            if (req.body.parolaNoua1 == req.body.parolaNoua2) {
                bcrypt.hash(req.body.parolaNoua1, saltRounds, (err, hash) => {
                    if (err) {
                        console.error(err);
                    }
                    db.Admin.update({ password: hash }, { where: { id: req.body.userId } });
                })
            } else
                console.error("Parolele noi nu coincid!")
        } else bcrypt.compare(req.body.parolaVeche, profile.password, (error, response) => {
            if (response) {
                if (req.body.parolaNoua1 == req.body.parolaNoua2) {
                    bcrypt.hash(req.body.parolaNoua1, saltRounds, (err, hash) => {
                        if (err) {
                            console.error(err);
                        }
                        db.Admin.update({ password: hash }, { where: { id: req.body.userId } });
                    })
                } else
                    console.error("Parolele noi nu coincid!")
            }
            else console.error("Parola veche nu este buna!")
        })
    }
})

//route for dashboard
router.get('/dashboard', authorizationMiddleware, async (req, res) => {
    let userType = req.body.userType


    if (userType === "student") {
        const student = await db.Student.findByPk(req.body.userId);
        res.render("studentDashboard", { body: student })
    } else if (userType === "profesor") {
        const professor = await db.Professor.findByPk(req.body.userId);
        res.render("professorDashboard", { body: professor })
    } else if (userType === "admin") {
        const admin = await db.Admin.findByPk(req.body.userId);
        res.render("adminDashboard", { body: admin })
    } else if (userType === "conducere") {
        const conducere = await db.Admin.findByPk(req.body.userId);
        res.render("conducereDashboard", { body: conducere })
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
        .render('login', { txt: "V-ati deconectat cu succes!" })
});

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

//all feedbacks
router.get('/allFeedbacks', authorizationMiddleware, async (req, res) => {
    let userType = req.body.userType
    if (userType === "admin" || userType === "conducere") {
        allFeedbacks = await db.Feedback.findAll()
        allProfessors = await db.Professor.findAll()
        allQuestions = await db.Question.findAll()
        res.render('allFeedbacks', { allFeedbacks, allProfessors, allQuestions })
    }
    else {
        res.send("Nu sunteti admin!");
    }
})

// //statistici
router.get('/statistici', authorizationMiddleware, async (req, res) => {
    let userType = req.body.userType
    if (userType === "admin" || userType === "conducere") {
        allFeedbacks = await db.Feedback.findAll()
        allProfessors = await db.Professor.findAll()
        allStudents = await db.Student.findAll()

        //profesori evaluati
        let idProfesoriEvaluati = []
        let idProfesoriEvaluati_ = []
        for (let i = 0; i < allFeedbacks.length; i++) {
            idProfesoriEvaluati_.push(allFeedbacks[i]['dataValues']['id_profesor'])
            if (!idProfesoriEvaluati.includes(allFeedbacks[i]['dataValues']['id_profesor']))
                idProfesoriEvaluati.push(allFeedbacks[i]['dataValues']['id_profesor'])
        }

        //studenti evaluatori
        let idStudentiEvaluatori = []
        let idStudentiEvaluatori_ = []
        for (let i = 0; i < allFeedbacks.length; i++) {
            idStudentiEvaluatori_.push(allFeedbacks[i]['dataValues']['id_student'])
            if (!idStudentiEvaluatori.includes(allFeedbacks[i]['dataValues']['id_student']))
                idStudentiEvaluatori.push(allFeedbacks[i]['dataValues']['id_student'])
        }

        let id_celeMaiMulteEvaluari = -1
        let nrEvaluari = 0
        if (idProfesoriEvaluati.length > 0) {
            let contor = 0
            id_celeMaiMulteEvaluari = idProfesoriEvaluati[0]

            for (let i = 0; i < idProfesoriEvaluati.length; i++) {

                for (let j = 0; j < idProfesoriEvaluati_.length; j++) {
                    if (idProfesoriEvaluati_[j] == idProfesoriEvaluati[i])
                        contor++
                }
                if (contor > nrEvaluari) {
                    nrEvaluari = contor
                    id_celeMaiMulteEvaluari = idProfesoriEvaluati[i]
                }
                contor = 0
            }
        } else { res.send("Nu exista profesori evaluati") }


        let nrrEvaluari = 0
        let sumEvaluari = 0
        let nota
        let notaMicaFinala = 11
        let notaMareFinala = 0
        let id_ceaMaiMareNota = -1
        let id_ceaMaiMicaNota = -1
        for (let i = 0; i < idProfesoriEvaluati.length; i++) {
            for (let j = 0; j < allFeedbacks.length; j++) {
                if (allFeedbacks[j]['dataValues']['id_profesor'] == idProfesoriEvaluati[i]) {
                    nrrEvaluari++
                    sumEvaluari += parseInt(allFeedbacks[j]['dataValues']['raspuns'])
                }
            }
            nota = sumEvaluari / nrrEvaluari
            if (notaMareFinala < nota) {
                notaMareFinala = nota
                id_ceaMaiMareNota = idProfesoriEvaluati[i]
            }
            if (notaMicaFinala > nota) {
                notaMicaFinala = nota
                id_ceaMaiMicaNota = idProfesoriEvaluati[i]
            }
        }
        const procentProfesoriEvaluati = idProfesoriEvaluati.length / allProfessors.length * 100
        const procentStudentiEvaluatori = idStudentiEvaluatori.length / allStudents.length * 100
        const celMaiEvaluat_Prof = await db.Professor.findByPk(id_celeMaiMulteEvaluari)
        const ceaMaiMareNota_Prof = await db.Professor.findByPk(id_ceaMaiMareNota)
        const ceaMaiMicaNota_Prof = await db.Professor.findByPk(id_ceaMaiMicaNota)
        

        res.render('statisticiEvaluari', {
            celMaiEvaluat_ProfFirstName: celMaiEvaluat_Prof.firstName, celMaiEvaluat_ProfLastName: celMaiEvaluat_Prof.lastName, nrEvaluari,
            notaMareFinala, ceaMaiMareNota_ProfFirstName: ceaMaiMareNota_Prof.firstName, ceaMaiMareNota_ProfLastName: ceaMaiMareNota_Prof.lastName,
            notaMicaFinala, ceaMaiMicaNota_ProfFirstName: ceaMaiMicaNota_Prof.firstName, ceaMaiMicaNota_ProfLastName: ceaMaiMicaNota_Prof.lastName,
            procentProfesoriEvaluati, idProfesoriEvaluatiLength: idProfesoriEvaluati.length, allProfessorsLength: allProfessors.length,
            procentStudentiEvaluatori, idStudentiEvaluatoriLength: idStudentiEvaluatori.length, allStudentsLength: allStudents.length
        })
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
router.get("/profesori/:materie", authorizationMiddleware, async (req, res) => {
    let userType = req.body.userType
    let userId = req.body.userId
    let materie = req.params.materie
    if (userType === "student") {
        try {
            let grupaStudent = await db.Student.findByPk(userId)
            let materii = await db.Subject.findAll({ where: { nume_materie: materie, grupa: grupaStudent.class } })
            if (materii.length > 0) {
                let id_profesor = materii[0].id_profesor
                let profesor = await db.Professor.findByPk(id_profesor)
                let Q = await db.Question.findAll()
                res.render('chestionar', { idProfessor: profesor.id, firstNameProfessor: profesor.firstName, lastNameProfessor: profesor.lastName, Q: Q });
            }else res.send("<h1>Aveti acces doar la cursurile grupei de care apartineti!!</h1>");
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
        let materii = await db.Subject.findAll({ where: { grupa: student['dataValues']['class'], } });
        res.render('materii', { materii: materii, student: student });
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
            console.error('Error on updating user: ', error);
        }

    } else res.send("<h1>Nu aveti acces!!</h1>");
})

router.post("/questions", authorizationMiddleware, async (req, res) => {
    let userType = req.body.userType
    if (userType === "conducere") {
        try {
            await db.Question.create({ intrebare: req.body.inputu })
            const feedbacks = await db.Feedback.findAll()
            const id_intrebare_adaugata = await db.Question.findOne({ where: { intrebare: req.body.inputu } })
            const id_intrebare = feedbacks[0]['dataValues']['id_intrebare']
            const fb = await db.Feedback.findAll({ where: { id_intrebare: id_intrebare, } })
            for (let i = 0; i < feedbacks.length; i++) {
                await db.Feedback.create({ id_student: fb[i]['dataValues']['id_student'], id_profesor: fb[i]['dataValues']['id_profesor'], id_intrebare: id_intrebare_adaugata['dataValues']['id'] })
            }

        } catch (error) {
            console.error('Error on updating user: ', error);
        }
        const questions = await db.Question.findAll()
        res.send({ questions })
    } else res.send("<h1>Nu aveti acces!!</h1>");
})

router.post("/chestionar/:id", authorizationMiddleware, async (req, res) => {
    const professorId = req.params.id;
    let userType = req.body.userType
    const DB = await db.Question.findAll()
    if (userType === "student") {
        try {
            let rez = null;
            for (let i = 0; i < req.body.inputu.length; i++) {
                rez = null;
                q = await db.Question.findAll()
                rez = await db.Feedback.findOne({
                    where: {
                        id_student: req.body.userId,
                        id_profesor: professorId,
                        id_intrebare: q[i]['dataValues']['id'],
                    }
                })

                if (rez) {
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
            console.error('Error on updating user: ', error);
        }
        let student = await db.Student.findByPk(req.body.userId)
        let materii = await db.Subject.findAll({ where: { grupa: student['dataValues']['class'], } });
        let materii_grupa = []
        for (let i = 0; i < materii.length; i++) {
            let k = 1
            for (let j = 0; j < materii_grupa.length; j++) {
                if (materii[i]['dataValues']['nume_materie'] == materii_grupa[j]) {
                    k = 0
                }
            }
            if (k == 1)
                materii_grupa.push(materii[i]['dataValues']['nume_materie'])
        }
        res.render('materii', { materii: materii, materii_grupa: materii_grupa, student: student });
    } else if (userType === "profesor") {
        res.send("<h1>Nu sunteti student!</h1>");
    }
    else { res.send("smth went wrong") }
});

module.exports = router;