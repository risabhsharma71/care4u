'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const patientDataSchema = mongoose.Schema({
    
    patientData:Object,
    HospitalName:String,
    status:String,
    
    created_at: String
    
});


mongoose.Promise = global.Promise;

mongoose.connect('mongodb://risabhsharma71:Rpqb123@ds111420.mlab.com:11420/care4u', { useMongoClient: true });


module.exports = mongoose.model('patientData', patientDataSchema);