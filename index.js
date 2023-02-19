require('dotenv').config();
const http = require('http');
const cors = require('cors');
const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const Config = require("./src/config")
const {connectToMongoDB, studentSchema} = require('./mongo');
const ServerlessHttp = require('serverless-http');

const app = express();
const router = express.Router();

// Initialize mongoose connection
await connectToMongoDB();

const Student = mongoose.model("Student", studentSchema);

// add static folder for nextjs
app.use(express.static('public'))

// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.get('/', (req, res) => res.json({status: "Server is alive"}))

app.get('/find-student/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findOne({id});

    if(student) res.json({success: true, student})
    
    else res.json({success: false, error: "Student does not exist"});
  } catch (error) {
    res.status(500).json({success: false, error: "Internal Server Error!"});
  }
});

app.post('/register', async (req, res) => {
  try {
    console.log("Request Body: ", req.body);
    const newStudent = new Student(req.body);

    const studentExists = await Student.findOne({id: newStudent.id});

    if(studentExists) return res.status(401).json({success: false, error: "Student already exist"});

    const response = await newStudent.save();

    res.status(200).json({success: true, data: response});
  } catch (error) {
    res.status(500).json({success: false, error});
  }    
})

app.use('/.netlify/functions/api', router);

module.exports.handler = ServerlessHttp(app)