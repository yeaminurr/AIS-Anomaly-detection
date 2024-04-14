
const express = require("express");
const bodyParser = require("body-parser");
let getData = require("./routes/getData");
const mongoose = require("mongoose");
const server = express();
let getAIS = require("./routes/getAIS");



server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json())
mongoose.connect("mongodb://127.0.0.1:27017/viz_project")
    .then(()=>{
        console.log(" mongodb connected")
    })
    .catch((err)=>{
        console.log(err)
    })

// Add headers before the routes are defined
server.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


server.use("/api/getdata",getData);
server.use("/api/getais",getAIS);
server.listen(5000);