const db = require("../models");

//courses
module.exports.getAllCourses = (req, res) => {
    res.render('base', { title: "Cursuri aici" });
}

module.exports.getCourseById = (req, res) => {
    res.render('dashboard', { title: "Login System" });
}

//students
module.exports.getAllStudents = async (req, res) => {
    try {
        const allStudents = await db.Student.findAll();
        res.send(allStudents);
    } catch (error) {
        console.error("N-a mers ceva");
        res.send({
            error: "Ceva nu ie bine",
        });
    };
}

module.exports.getStudentById = async (req, res) => {
    const studentId = req.params.id;
    try {
        console.log(studentId)
        const student = await db.Student.findByPk(studentId);
        res.send(student);
    } catch (error) {
        console.error(error);
        res.send({
            error: "Something went wrong",
        });
    }
}

module.exports.createStudent = (req, res) => {

}

module.exports.updateStudent = (req, res) => {

}

module.exports.deleteStudent = (req, res) => {

}

//Professors
module.exports.getAllProfessors = async (req, res) => {
    try {
        const allProfessors = await db.Professor.findAll();
        res.send(allProfessors);
    } catch (error) {
        console.error("N-a mers ceva");
        res.send({
            error: "Ceva nu ie bine",
        });
    };
}

module.exports.getProfessorById = async (req, res) => {
    const professorId = req.params.id;
    let userType = req.body.userType
    if (userType === "student") {
        try {
            console.log(professorId)
            const professor = await db.Professor.findByPk(professorId);
            res.send({professor});
        } catch (error) {
            console.error(error);
            res.send({
                error: "Something went wrong",
            });
        }
    } else if (userType === "profesor"){
        res.send("<h1>Nu sunteti student!</h1>");
    }
    else {res.send("smth went wrong")}
}

module.exports.createProfessor = (req, res) => {

}

module.exports.updateProfessor = (req, res) => {

}

module.exports.deleteProfessor = (req, res) => {

}
