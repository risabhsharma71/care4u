'use strict';
const Pateint = require('../models/patientData');
var nem = require("nem-sdk").default;

exports.createContract =(conditions,HospitalName,submitID,status,TotalClaimedAmount) =>{

 return    new Promise((resolve, reject) => {
        console.log("conditions==================>",conditions)
            const data  = new Pateint({
                "patientData":conditions,
                "HospitalName":HospitalName,
                "submitID":submitID,
                "status":status,
                "TotalClaimedAmount":TotalClaimedAmount,
                  created_at: new Date()
                });
                console.log("discharge summary====================>",data)
              
                data.save()
            
    
            .then(() => resolve({
                status: 201,
                message: 'Patient details saved'
            }))

            .catch(err =>{ 

                    reject({
                        status: 500,
                        message: 'Internal Server Error !'
                    });
 });

        })
    }