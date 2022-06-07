var express = require("express");
var router = express.Router();
const {getAllCourses, getCourseById,
    getAllStudents, getStudentById, createStudent, updateStudent, deleteStudent,
    getAllProfessors, getProfessorById, createProfessor, updateProfessor, deleteProfessor,
} = require('./controllers/users');
const { sequelize } = require("./models");
const db = require("./models");


const  credential = {
    email : "admin@s.unibuc.ro",
    password : "admin123"
}

// login user
router.post('/login', async (req, res,next)=>{
    
    let req_email = req.body.email;
	let req_password = req.body.password;
	let rez =await db.Student.findAll({
        where: {
          email: req_email,
        }
      });
      //console.log('REZ1',rez)
      
    
    
      if(req_email.toString() === rez[0].email.toString() && req_password.toString() === rez[0].password.toString()){
        console.log("ie bune alea");
        req.session.user = req.body.email;
        res.redirect('/route/dashboard');
        //res.end("Login Successful...!");
    }else{
        console.log("nu ie bune alea");
        //alert("Ceva nu ie bine dă ce mă-ntrebi?");
        res.end("Invalid")
    }
    console.log('req_email, rez[0].email, req_password, rez[0].password\n', req_email.toString(), rez[0].email.toString(), req_password, rez[0].password)

    //console.log('REZ2',rez)
	// sequelize.query('SELECT * FROM Students WHERE email = '+email+' AND password = '+password+' ',{model: db.Students})
    // if (email && password) {
    //     console.log(email, password)
		
	// 	db.get('SELECT * FROM Students WHERE email = ? AND password = ?', [email, password], function(error, results, fields) {
			
	// 		if (error) throw error;
			
	// 		if (results.length > 0) {
				
	// 			req.session.loggedin = true;
	// 			req.session.username = username;
				
	// 			res.redirect('/route/dashboard');
	// 		} else {
	// 			res.send('Incorrect Username and/or Password!');
	// 		}			
	// 		res.end();
	// 	});
	// } else {
	// 	res.send('Please enter Username and Password!');
	// 	res.end();
	// }


    // if(req.body.email == credential.email && req.body.password == credential.password){
    //     console.log("ie bune alea");
    //     req.session.user = req.body.email;
    //     res.redirect('/route/dashboard');
    //     //res.end("Login Successful...!");
    // }else{
    //     console.log("nu ie bune alea");
    //     //alert("Ceva nu ie bine dă ce mă-ntrebi?");
    //     res.end("Invalid")
    // }
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