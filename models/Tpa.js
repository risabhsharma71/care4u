'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TpaSchema = mongoose.Schema({
    
    patientData:{ type: Object, unique: true },
    status:String,
    HospitalName:String,
    AmountPayerWouldPay:Number,
    AmountuserHavetopay:Number,
    created_at: Date
    
});


mongoose.Promise = global.Promise;

mongoose.connect('mongodb://risabhsharma71:Rpqb123@ds111420.mlab.com:11420/care4u', { useMongoClient: true });


module.exports = mongoose.model('Tpa', TpaSchema);