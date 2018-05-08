

var patientData= require("../models/patientData");
var Tpa = require('../models/Tpa');
var aprovedArray=[];
exports.mock=()=>{
    return new Promise(async(resolve,reject)=>{
    let results1= await  Tpa.find({})
        for(let a=0;a<results1.length;a++ ){
            aprovedArray.push(results1[a])
        }
            console.log(aprovedArray)
            resolve({
                "status":200,
                "message":aprovedArray
            })
    })
}