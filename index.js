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
const note = require('./Modals/note');

db.once('open', function() {
    
    app.get("/getclass", async function(req,res){
        
        let classroom = await Classroom.find({});
        res.json({statusCode:200, list:classroom });
    })
    app.get("/getClasstoJoinStudent", async function(req,res){
        
        let classroom1 = await Classroom.find({});
        let classroom2 = await Classroom.find({studentIds:req.query.id});
        let classtoJoin=[];
        for(let i=0;i<classroom1.length;i++)
        {
            if(classroom2.find(elm=>elm.id===classroom1[i].id)===undefined)
                classtoJoin.push(classroom1[i]);
        }

        res.json({statusCode:200, list:classtoJoin });
    })
    app.get("/getStudentClass", async function(req,res){
        
        let classroom = await Classroom.find({studentIds:req.query.id});
        res.json({statusCode:200, list:classroom });
    })
    
    app.get("/addToClass", async function(req,res){
        console.log(req.query.classId,req.query.id)
        let a= await Classroom.updateOne({id:req.query.classId},{ $push: { studentIds:req.query.id}});
        let b= await student.updateOne({id:req.query.id},{ $push:{courseList:req.query.classId}});
        res.json({statusCode:200});
    })
    app.get("/leaveClass", async function(req,res){
        console.log(req.query.classId,req.query.id)
        let a= await Classroom.updateOne({id:req.query.classId},{ $pull: { studentIds:req.query.id}});
        let b= await student.updateOne({id:req.query.id},{ $pull:{courseList:req.query.classId}});
        res.json({statusCode:200});
    })
    
    app.get("/addMessage", async function(req,res){
        let a= await Classroom.updateOne({id:req.query.classId},{$push:{chats:{
            messageBy:req.query.id,
            message:req.query.message,
            date:new Date()
        }}});
        res.json({statusCode:200});
    })
    
    app.get("/getMessage", async function(req,res){
        let classroom = await Classroom.find({id:req.query.classId});

        res.json({statusCode:200,chats:classroom.chats});
    })
    app.get("/addNote", async function(req,res){
        var newNote = new note({
            title:req.body.title,
            notes:req.body.notes,
            notesBy:req.body.id
        });
        newNote.save();
        res.json({statusCode:200});
    })
    
    app.get("/getNotes", async function(req,res){
        let notes = await note.find({notesBy:req.query.id});

        res.json({statusCode:200,notes:notes});
    })
    app.get("/getclassFaculty", async function(req,res){
        
        let classroom = await Classroom.find({facultyId:req.query.id});
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
        let id = uniqid();
        let facultydata= await faculty.find({id:req.body.facultyId},{schoolCode:1});
        var newclassroom = new classroom({
        id:id,
        name:req.body.name,
        subject:req.body.subject,
        link:req.body.link,
        facultyId:req.body.facultyId,
        schoolCode:facultydata.schoolCode
        });
        newclassroom.save();
        faculty.updateOne({id:req.body.facultyId},
            { $push: { courseList:id}});
        school.updateOne({schoolCode:facultydata.schoolCode},
            { $push: { courseIds:id}});

        res.json({statusCode:200 });
    
    })
    app.get("/getRole", async function(req,res){
        console.log(req.query.id);
        let isStudent = await student.find({id:req.query.id});
        let isFaculty = await faculty.find({id:req.query.id});
        console.log(isStudent,isFaculty);
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