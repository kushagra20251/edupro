var express = require('express');
var app = new express();
const mongoose = require('mongoose');
const bodyParser  = require('body-parser');
var uniqid = require('uniqid');

const router = express.Router();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const cors = require('cors');
app.use(cors({ origin: true }));

mongoose.connect('mongodb+srv://gourav:BPPiQ76BIJYIcM6X@cluster0.2assr.mongodb.net/eduPro?retryWrites=true&w=majority', {useNewUrlParser: true});


app.use("/", router);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

const Classroom = require('./Modals/classroom');
const school = require('./Modals/school');
const student = require('./Modals/student');
const faculty = require('./Modals/faculty');
const classroom = require('./Modals/classroom');

db.once('open', function() {
    
    app.get("/getclass", async function(req,res){
        
        let classroom = await Classroom.find({});
        res.json({statusCode:200, list:classroom });
    })

    app.post("/adminRegister", async function(req,res){
        var newschool = new school({
            name:req.body.name,
            schoolCode:req.body.id,
            password:req.body.password,
            email:req.body.email,
        });
        newschool.save();
        res.json({statusCode:200, list:classroom });
    })
    app.post("/studentRegister", async function(req,res){
        let schoolMatch=  await school.find({name:req.body.schoolName,schoolCode:req.body.schoolCode});
        if(schoolMatch.length>0)
        {
            var newstudent = new student({
                id:req.body.id,
                name:req.body.name,
                schoolCode:req.body.schoolCode,
                password:req.body.password,
                email:req.body.email
            });
            newstudent.save();
            res.json({statusCode:200 });
        }
        else
        {
            res.json({statusCode:404, error:"school code not match" });
        }
    })
    app.post("/facultyRegister", async function(req,res){
        let schoolMatch=  await school.find({name:req.body.schoolName,schoolCode:req.body.schoolCode});
        if(schoolMatch.length>0)
        {
            var newfaculty = new faculty({
            id:req.body.id,
            name:req.body.name,
            schoolCode:req.body.schoolCode,
            password:req.body.password,
            email:req.body.email
            });
            newfaculty.save();
            res.json({statusCode:200 });
        }
        else
        {
            res.json({statusCode:404, error:"school code not match" });
        }
    })
    
    app.post("/addClass", async function(req,res){
        var newclassroom = new classroom({
        id:req.body.id,
        name:req.body.name,
        subject:req.body.subject,
        link:req.body.link,
        facultyId:req.body.facultyId,
        schoolCode:req.body.schoolCode
        });
        newclassroom.save();
        res.json({statusCode:200 });
    
    })
    app.get("/getRole", async function(req,res){
        let isStudent = await student.find({id:req.query.id});
        let isFaculty = await faculty.find({id:req.query.id});
        if(isStudent.length>0)
            res.json({statusCode:200,role:'student'});
        else if(isFaculty.length>0)
            res.json({statusCode:200,role:'faculty'});
        else res.json({statusCode:200,role:'admin'});
    })

    const PORT = process.env.PORT || 80;

    app.listen(PORT, function () {
        console.log('Listening to Port 80');
    });
});