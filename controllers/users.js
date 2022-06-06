const db = require("../models");


//courses
module.exports.getAllCourses = (req, res) => {
    res.render('base', { title : "Cursuri aici"});
}

module.exports.getCourseById = (req, res) => {
    res.render('dashboard', { title : "Login System"});
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

module.exports.getStudentById = async(req, res) => {
    const studentId = req.params.id;
    try{
        const student = await db.Student.findByPk({
            id: studentId,
        });
        res.send(student);
    }catch (error) {
        console.error('Something went wrong');
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
module.exports.getAllProfessors = (req, res) => {
    res.render('base', { title : "Login System"});
}

module.exports.getProfessorById = (req, res) => {
    res.render('dashboard', { title : "Login System"});
}

module.exports.createProfessor = (req, res) => {
    
}

module.exports.updateProfessor = (req, res) => {
    
}

module.exports.deleteProfessor = (req, res) => {
    
}