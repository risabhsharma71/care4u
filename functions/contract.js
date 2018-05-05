'use strict';
const Pateint = require('../models/patientData');
var nem = require("nem-sdk").default;

exports.createContract =(conditions,HospitalName,status) =>{

 return    new Promise((resolve, reject) => {
     
            const data  = new Pateint({
                "patientData":conditions,
                "HospitalName":HospitalName,
                "status":status,
                  created_at: new Date()
                });
              
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