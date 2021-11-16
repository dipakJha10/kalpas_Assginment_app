const mongoose = require("mongoose");

const InsuranceModel = new mongoose.Schema({
    policyID: {
        type: String,
        required: true
    },
    statecode: {
        type: String,
        required: true
    },
    eq_site_limit: {
        type: String,
        required: true
    },
    fl_site_limit: {
        type: String
    },
    fr_site_limit: {
        type: String,
        required: true
    },
    tiv_2011: {
        type: String
    },
    tiv_2012: {
        type: String
    },
    eq_site_deductible: {
        type: String
    },
    hu_site_deductible: {
        type: String
    },
    fl_site_deductible: {
        type: String
    },
    fr_site_deductible: {
        type: String
    },
    fr_site_deductible: {
        type: String
    },
    point_longitude: {
        type: String
    },
    line: {
        type: String
    },
    point_granularity: {
        type: String
    }
});

const insurance = mongoose.model("insurance", InsuranceModel);

module.exports = {
    insurance
};