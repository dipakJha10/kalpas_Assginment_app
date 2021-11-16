const app = require('express')();
const bodyparser = require('body-parser');
const express = require('express')
const uploadRoute = require("./routes/endPoints");
const auth = require("./routes/auth");
const authService = require("./configs/authinfo");
const constants = require("./util/constants");
const jwt = require('jsonwebtoken');
const authInfo = require("./configs/authinfo");
const httpStatus = require('http-status');
const path=require("path")

const db = require('./db/db');
const morgan = require('morgan')
app.use(morgan('dev'))

global.__basedir = __dirname + "/..";

app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())

app.use("/api", auth);
app.get("/", (req, res) => {
  res.send("Rest APIs for CSV file Reader  are up and running!!");
});


app.use(authService.verifyToken, function (req, res, next) {
    jwt.verify(req.token, authInfo.secretKey, async (err, authData) => {
        if (err) {
            res.status(403).send({ status: httpStatus.FORBIDDEN, message: constants.FORBIDDEN_MSG, data: null });
        } else {
            next();
        }
    })

});

app.use("/api", uploadRoute);



app.listen(process.env.PORT || 8000, () => {
    console.log('App listening on port 3000' ,process.env.PORT || 8000);
});