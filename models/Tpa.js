'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TpaSchema = mongoose.Schema({
    
    patientData: Array,
    status:String,
    submitID:String,
    HospitalName:String,
    AmountPayerWouldPay:Number,
    AmountuserHavetopay:Number,
    Expenses:Number,
    message:String,
    rapidID:String,
    txHash:String,
    previousHashes:Array,
    created_at: Date
    
});


mongoose.Promise = global.Promise;

mongoose.connect('mongodb://risabhsharma71:Rpqb123@ds111420.mlab.com:11420/care4u', { useMongoClient: true });


module.exports = mongoose.model('Tpa', TpaSchema);