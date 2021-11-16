const router = require('express').Router();
const dbServices = require('../models/models');
const httpStatus = require('http-status');
const upload = require("../util/fileUpload");
const fs = require("fs");
const csv = require("fast-csv");

const insuranceServices = dbServices.insurance;

router.post('/upload', upload.single("file"), async (req, res) => {
    try {
        if (req.file == undefined) {
            return res.status(400).send({ "message": "Please upload a CSV file!" });
        }

        let insurance = [];
        let path = __basedir + "/KALPAS-CSV-CLOUD-MONGO/" + req.file.filename;

        fs.createReadStream(path)
            .pipe(csv.parse({ headers: true }))
            .on("error", (error) => {
                throw error.message;
            })
            .on("data", (row) => {
                insurance.push(row);
            })
            .on("end", () => {

                insuranceServices.insertMany(insurance).then((result) => {
                    console.log("Updation done")
                }).catch((error) => {
                    console.log(error)
                });
                res.status(200).send({ "success": "CSV file uploaded successfully" });

            });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Could not upload the file: " + req.file.originalname,
        });
    }

});

router.get('/insurance', async (req, res) => {
    let offset;
    let limit;
    if (req.query.pageNo && req.query.perPage) {
        req.query.perPage = parseInt(req.query.perPage);
        req.query.pageNo = parseInt(req.query.pageNo);
        offset = req.query.perPage * (req.query.pageNo - 1);
        limit = req.query.perPage;
    } else {
        offset = 0;
        limit = 20;
    }
    try {
        const insurance = await insuranceServices.find({
        })
            .skip(offset)
            .limit(limit);
        res.status(200).json({ status: httpStatus.OK, message: "Request Success Full!!", data: insurance });
    } catch (error) {
        console.log(error)
        res.status(500).send({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Request not completed!!", data: null });
    }

});

router.post('/insurance', async (req, res) => {
    let newInsurance = new insuranceServices(req.body);
    try {
        const insurance = await newInsurance.save();
        res.status(200).json({ status: httpStatus.OK, message: "request successfull", data: insurance });
    } catch (exception) {
        console.log(exception)
        res.status(500).send({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "request Failed", data: null });
    }

});


router.put('/insurance', async (req, res) => {

    try {
        let result = await insuranceServices.findOneAndUpdate({ policyID: req.body.policyID }, req.body, {
            new: true,
            upsert: true,
            rawResult: true // Return the raw result from the MongoDB driver
        });
        res.status(200).json({ status: httpStatus.OK, message: "request successfull", data: result.value });
    } catch (exception) {
        console.log(exception)
        res.status(500).send({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "request Failed", data: null });
    }

});

router.delete('/insurance', async (req, res) => {
    try {
        let result = await insuranceServices.findOneAndDelete({ policyID: req.body.policyID });
        res.status(200).json({ status: httpStatus.OK, message: "request successfull", data: result.value });
    } catch (exception) {
        console.log(exception)
        res.status(500).send({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "request Failed", data: null });
    }

});


module.exports = router;