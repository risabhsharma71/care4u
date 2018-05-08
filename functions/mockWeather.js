


'use strict';
var patientData = require("../models/patientData")
var Tpa = require("../models/Tpa")
var nem = require("nem-sdk").default;
var fs =require("fs")
var jsonfile = require('jsonfile')
var file = require("../payerInsuree.json")
var file1= require("../payer_provider.json")
var AddressOfProvider1="MDQ52TVBHGD5HAQF2NL27WPVS5I7JZ7KQXF4FDAS";
var addressofProvider2="MAN3JN6GBWNT5XJOND5BEYG4SQRR2B6YJ3BSU6PR";
var report;



exports.mock =(obj) =>{
     
    return new Promise(async(resolve,reject)=>{

            
        let result= await  patientData.find({status:"initiated"})
        //  .then(result =>{
        for(let i=0;i<result.length;i++){
            var HospitalName=result[i]._doc.HospitalName;
//===========================if the total bill is less than preproposed amount then check of each hospital===========================//            
            if(result[i].patientData.TotalClaimedAmount<=file.CoverageAmt && result[i].patientData.TotalClaimedAmount<=file.preproposedAmt){
               console.log("bill less than equal to preproposed amount",result[i].patientData.TotalClaimedAmount<=file.CoverageAmt && result[i].patientData.TotalClaimedAmount<=file.preproposedAmt)
                if(HospitalName=="Fortis"){
                    var data  = new Tpa({
                        "patientData":result[i]._doc.patientData,
                        "HospitalName":result[i]._doc.HospitalName,
                        "status":"approved",
                        "AmountPayerWouldPay":result[i]._doc.patientData.TotalClaimedAmount*0.8,
                        "AmountuserHavetopay":result[i]._doc.patientData.TotalClaimedAmount*0.2,
                          created_at: new Date()
                        });
                     data.save()

            var endpoint =nem.model.objects.create("endpoint")("http://b1.nem.foundation", "7895");    
            // Create a common object holding key
            var common = nem.model.objects.create("common")("123","8de216c125beb4d25d484919ad5168b67a3274dc9746e0d42d94f409a756ae7b");
            // Create an un-prepared transfer transaction object
           
                var transferTransaction = nem.model.objects.create("transferTransaction")(AddressOfProvider1, 0,"auto Approved  ");
            // Prepare the transfer transaction object
            var transactionEntity = nem.model.transactions.prepare("transferTransaction")(common, transferTransaction, nem.model.network.data.mijin.id);
            
            //Serialize transfer transaction and announce
               var ee= nem.model.transactions.send(common, transactionEntity, endpoint)
                     resolve(patientData.remove({_id:result[i].id}))
        
                   }
        if(HospitalName=="Apollo"){
            var data  = new Tpa({
                "patientData":result[i]._doc.patientData,
                "status":"approved",
                "HospitalName":result[i]._doc.HospitalName,
                "AmountPayerWouldPay":result[i]._doc.patientData.TotalClaimedAmount,
                "AmountuserHavetopay":0,
                  created_at: new Date()
                });
             data.save()
           
            var endpoint =nem.model.objects.create("endpoint")("http://b1.nem.foundation", "7895");    
            // Create a common object holding key
            var common = nem.model.objects.create("common")("123","8de216c125beb4d25d484919ad5168b67a3274dc9746e0d42d94f409a756ae7b");
            
            // Create an un-prepared transfer transaction object
           
                var transferTransaction = nem.model.objects.create("transferTransaction")(addressofProvider2, 0,"auto Approved");
            // Prepare the transfer transaction object
            var transactionEntity = nem.model.transactions.prepare("transferTransaction")(common, transferTransaction, nem.model.network.data.mijin.id);
            
            //Serialize transfer transaction and announce
              var ee=  nem.model.transactions.send(common, transactionEntity, endpoint)
                console.log("eeeeeeeeeeeeeeeeeeeeeeeeee==========================>",ee)
            resolve(patientData.remove({_id:result[i].id}))
           
        }
    }
    //===========================if patients data is 10% more than preproposed amount============================================================//
    if(result[i].patientData.TotalClaimedAmount<=file.CoverageAmt && ((result[i].patientData.TotalClaimedAmount)<=(file.preproposedAmt+file.preproposedAmt*0.1))&&(result[i].patientData.TotalClaimedAmount>file.preproposedAmt)){
    console.log("if the amt is greater but less than 10%",result[i].patientData.TotalClaimedAmount<=file.CoverageAmt && ((result[i].patientData.TotalClaimedAmount)<=(file.preproposedAmt+file.preproposedAmt*0.1))&&(result[i].patientData.TotalClaimedAmount>file.preproposedAmt))
      
        if(HospitalName=="Fortis"){
        var data  = new Tpa({
            "patientData":result[i]._doc.patientData,
            "status":"Waiting for Tpa approval(24hr)",
            "HospitalName":result[i]._doc.HospitalName,
            "AmountPayerWouldPay":file.preproposedAmt*0.8,
            "AmountuserHavetopay":file.preproposedAmt*0.2+(result[i]._doc.patientData.TotalClaimedAmount-file.preproposedAmt),
          
              created_at: new Date()
            });
            data.save()
            .then(() => (console.log("saved in tpa schema")))
            .catch(err => {
                if (err.code == 11000) {
                        console.log("duplicate data not feed to db")
                }})
    
            patientData.remove({_id:result[i].id}).then(hell=>{
                console.log("removed patient data from pateint data schema and moved to tpa schema for tpas approval")
            })
        }   
        if(HospitalName=="Apollo"){
            var data  = new Tpa({
                "patientData":result[i]._doc.patientData,
                "HospitalName":result[i]._doc.HospitalName,
                "AmountPayerWouldPay":file.preproposedAmt,
            "AmountuserHavetopay":(result[i]._doc.patientData.TotalClaimedAmount-file.preproposedAmt),
                "status":"Waiting for Tpa approval(24hr)",
                  created_at: new Date()
                });
              
                data.save()
                .then(() => (console.log("saved in tpa schema")))
                .catch(err => {
                    if (err.code == 11000) {
                            console.log("duplicate data not feed to db")
                    }})
        
               resolve(patientData.remove({_id:result[i].id}))
            } 
    }
       
          if(result[i].patientData.TotalClaimedAmount<=file.CoverageAmt && (result[i].patientData.TotalClaimedAmount >file.preproposedAmt)){
              console.log("when amount is way out of range",(result[i].patientData.TotalClaimedAmount<=file.CoverageAmt && (result[i].patientData.TotalClaimedAmount >file.preproposedAmt)))
              if(HospitalName=="Fortis"){
            var data  = new Tpa({
                "patientData":result[i]._doc.patientData,
                "status":"Waiting for Tpa approval",
                "HospitalName":result[i]._doc.HospitalName,
                "AmountPayerWouldPay":file.preproposedAmt*0.8,
                "AmountuserHavetopay":file.preproposedAmt*0.2+(result[i]._doc.patientData.TotalClaimedAmount-file.preproposedAmt),
                  created_at: new Date()
                });

                data.save()
                .then(() => (console.log("saved in tpa schema")))
                .catch(err => {
                    if (err.code == 11000) {
                            console.log("duplicate data not feed to db")
                    }})
        
               resolve(patientData.remove({_id:result[i].id}))
           
        }

if(HospitalName=="Apollo"){
    var data  = new Tpa({
        "patientData":result[i]._doc.patientData,
        "status":"Waiting for Tpa approval",
        "HospitalName":result[i]._doc.HospitalName,
        "AmountPayerWouldPay":file.preproposedAmt,
        "AmountuserHavetopay":(result[i]._doc.patientData.TotalClaimedAmount-file.preproposedAmt),
          created_at: new Date()
        });
        data.save()
        .then(() => (console.log("saved in tpa schema")))
        .catch(err => {
            if (err.code == 11000) {
                    console.log("duplicate data not feed to db")
            }})

       resolve(patientData.remove({_id:result[i].id}))
   
}

        }
    }

        resolve({"status":200,
        "message":"dataset completed waiting for new dataset"})
   
          })
    
    }
        
