const db = require("../models");
const excelJS = require("exceljs");

module.exports.getExcel = async (req, res) => {
    const workbook = new excelJS.Workbook();
    const worksheetStudenti = workbook.addWorksheet("Lista Studenti");
    const worksheetProfesori = workbook.addWorksheet("Lista Profesori");
    const worksheetFeedbacks = workbook.addWorksheet("Lista Feedbacks");
    const path = "./files";

    // export studenti
    let listaStudenti = []
    const studenti = await db.Student.findAll()
    for (let i = 0; i < studenti.length; i++) {
        listaStudenti.push(studenti[i])
    }

    worksheetStudenti.columns = [
        { header: "ID", key: "id", width: 10 },
        { header: "First Name", key: "firstName", width: 10 },
        { header: "Last Name", key: "lastName", width: 10 },
        { header: "Email Id", key: "email", width: 10 },
        { header: "Password", key: "password", width: 10 },
        { header: "Type", key: "userType", width: 10 },
        { header: "Grupa", key: "class", width: 10 },
        { header: "An", key: "year", width: 10 },
        { header: "createdAt", key: "createdAt", width: 10 },
        { header: "updatedAt", key: "updatedAt", width: 10 },
    ];

    let counter = 1;

    listaStudenti.forEach((student) => {
        student.id = counter;
        worksheetStudenti.addRow(student);
        counter++;
    });

    worksheetStudenti.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
    });


    //export profesori
    let listaProfesori = []
    const profesori = await db.Professor.findAll()
    for (let i = 0; i < profesori.length; i++) {
        listaProfesori.push(profesori[i])
    }
    worksheetProfesori.columns = [
        { header: "ID", key: "id", width: 10 },
        { header: "First Name", key: "firstName", width: 10 },
        { header: "Last Name", key: "lastName", width: 10 },
        { header: "Email Id", key: "email", width: 10 },
        { header: "Password", key: "password", width: 10 },
        { header: "Type", key: "userType", width: 10 },
        { header: "createdAt", key: "createdAt", width: 10 },
        { header: "updatedAt", key: "updatedAt", width: 10 },
    ];

    counter = 1;

    listaProfesori.forEach((profesor) => {
        profesor.id = counter;
        worksheetProfesori.addRow(profesor);
        counter++;
    });

    worksheetProfesori.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
    });

    //export feedbacks
    let listaFeedbacks = []
    const feedbacks = await db.Feedback.findAll()
    for (let i = 0; i < feedbacks.length; i++) {
        listaFeedbacks.push(feedbacks[i])
    }

    worksheetFeedbacks.columns = [
        { header: "ID", key: "id", width: 10 },
        { header: "ID student", key: "id_student", width: 10 },
        { header: "ID profesor", key: "id_profesor", width: 10 },
        { header: "ID intrebare", key: "id_intrebare", width: 10 },
        { header: "Raspuns", key: "raspuns", width: 10 },
        { header: "createdAt", key: "createdAt", width: 10 },
        { header: "updatedAt", key: "updatedAt", width: 10 },
    ];

    counter = 1;

    listaFeedbacks.forEach((feedback) => {
        feedback.id = counter;
        worksheetFeedbacks.addRow(feedback);
        counter++;
    });

    worksheetFeedbacks.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
    });

    try {
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader("Content-Disposition", `attachment; filename=users.xlsx`);

        return workbook.xlsx.write(res).then(() => {
            res.status(200);
        });

    } catch (err) {
        console.error(err);
        console.log(listaStudenti[0]);
        res.send({
            status: "error",
            message: "Something went wrong",
        });
    }
}
module.exports.getFeedback = async (req, res) => {
    const workbook = new excelJS.Workbook();
    const worksheetFeedbacks = workbook.addWorksheet("Lista Feedbacks");
    const path = "./files";

    //export feedbacks
    let listaFeedbacks = []
    var updateObject = {}
    const feedbacks = await db.Feedback.findAll()
    const profesori = await db.Professor.findAll()
    for (let i = 0; i < feedbacks.length; i++) {
        const numeProfesor = await db.Professor.findOne({ where: { id: feedbacks[i].id_profesor } })
        updateObject = {}
        updateObject["id"] = feedbacks[i].id
        updateObject["numeProfesor"] = numeProfesor.firstName + " " + numeProfesor.lastName
        const intrebare = await db.Question.findOne({ where: { id: feedbacks[i].id_intrebare } })
        updateObject["intrebare"] = intrebare.intrebare
        updateObject["raspuns"] = feedbacks[i].raspuns
        listaFeedbacks.push(updateObject)
    }
    //console.log(listaFeedbacks)

    worksheetFeedbacks.columns = [
        { header: "ID", key: "id", width: 10 },
        { header: "Nume profesor", key: "numeProfesor", width: 20 },
        { header: "Intrebare", key: "intrebare", width: 70 },
        { header: "Raspuns", key: "raspuns", width: 30 },
    ];

    let counter = 1;

    listaFeedbacks.forEach((feedback) => {
        feedback.id = counter;
        worksheetFeedbacks.addRow(feedback);
        counter++;
    });

    worksheetFeedbacks.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
    });

    try {
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader("Content-Disposition", `attachment; filename=feedbacks.xlsx`);

        return workbook.xlsx.write(res).then(() => {
            res.status(200);
        });

    } catch (err) {
        console.error(err);
        console.log(listaStudenti[0]);
        res.send({
            status: "error",
            message: "Something went wrong",
        });
    }
}