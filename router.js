var express = require("express");
var router = express.Router();
const {getAllCourses, getCourseById,
    getAllStudents, getStudentById, createStudent, updateStudent, deleteStudent,
    getAllProfessors, getProfessorById, createProfessor, updateProfessor, deleteProfessor,
} = require('./controllers/users')
const db = require("./models");


const  credential = {
    email : "admin@s.unibuc.ro",
    password : "admin123"
}

// login user
router.post('/login', (req, res)=>{
    
    if(req.body.email == credential.email && req.body.password == credential.password){
        console.log("ie bune alea");
        req.session.user = req.body.email;
        res.redirect('/route/dashboard');
        //res.end("Login Successful...!");
    }else{
        console.log("nu ie bune alea");
        //alert("Ceva nu ie bine dă ce mă-ntrebi?");
        res.end("Invalid")
    }
});

// route for dashboard
router.get('/dashboard', (req, res) => {
    if(req.session.user){
        res.render('dashboard', {user : req.session.user})
    }else{
        res.send("Unauthorize User")
    }
})

// route for logout
router.get('/logout', (req ,res)=>{
    req.session.destroy(function(err){
        if(err){
            console.log(err);
            res.send("Error")
        }else{
            res.render('base', { title: "Express", logout : "logout Successfully...!"})
        }
    })
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