


'use strict';

var crypto = require('crypto');
var patientData = require("../models/patientData")
var Tpa = require("../models/Tpa")
var nem = require("nem-sdk").default;
var fs =require("fs")
var jsonfile = require('jsonfile')
var file = require("../payerInsuree.json")
var file1= require("../payer_provider.json")
var AddressOfProvider1="MBAPHIOTSEORVR5DMJGVOCAWC2HE4PH2JTBVHTG2";
var addressofProvider2="MALSD5RR7YN4YSFTQWOLJURZ2OINSME4GD5RBHZJ";
var report;



exports.mock =(obj) =>{
     
    return new Promise(async(resolve,reject)=>{

            
        let result= await  patientData.find({status:"initiated"})
        //  .then(result =>{
        for(let i=0;i<result.length;i++){
            var str=(JSON.stringify(result[i]._doc.patientData));
            console.log("str=========================>",str);
            const rapidID = crypto.createHash('sha256').update(str).digest('base64');
            var submitID=result[i]._doc.submitID;
            console.log("submitID",submitID)
            var HospitalName=result[i]._doc.HospitalName;
          

//===========================if the total bill is less than preproposed amount then check of each hospital===========================//            
            if(result[i].TotalClaimedAmount<=file.CoverageAmt && result[i].TotalClaimedAmount<=file.preproposedAmt){
           
                console.log("bill less than equal to preproposed amount",result[i].TotalClaimedAmount<=file.CoverageAmt && result[i].TotalClaimedAmount<=file.preproposedAmt)
    
                var transferObj={"id":result[i].id,
                "rapidID":rapidID,
                "submitID":submitID,
                "message":"Auto Approved",
                "status":"Auto Approved"
                                }
                if(HospitalName=="Fortis"){
    
       var string=JSON.stringify(transferObj)
       console.log("string========================>",string)
            var endpoint =nem.model.objects.create("endpoint")("http://b1.nem.foundation", "7895");    
            // Create a common object holding key
            var common = nem.model.objects.create("common")("123","cf07b9b0d72a0320aea551c67e994729284b044dd7f9ccea9612762f4e988d4e");
            // Create an un-prepared transfer transaction object
           
                var transferTransaction = nem.model.objects.create("transferTransaction")(AddressOfProvider1, 0,string);
            // Prepare the transfer transaction object
            var transactionEntity = nem.model.transactions.prepare("transferTransaction")(common, transferTransaction, nem.model.network.data.mijin.id);
            
            //Serialize transfer transaction and announce
               var ee= await nem.model.transactions.send(common, transactionEntity, endpoint)
               var data  = new Tpa({
                "patientData":result[i]._doc.patientData,
                "HospitalName":result[i]._doc.HospitalName,
                "status":"Auto approved",
                "submitID":submitID,
                "txHash":ee.transactionHash.data,
                "rapidID":rapidID,
                "previousHashes":[],
                "message":"Payment process initiated",
                "Expenses":result[i].TotalClaimedAmount,
                "AmountPayerWouldPay":result[i]._doc.TotalClaimedAmount*0.8,
                "AmountuserHavetopay":result[i]._doc.TotalClaimedAmount*0.2,
                  created_at: new Date()
                });
            data.save()
                     resolve(patientData.remove({_id:result[i].id}))
                   }
        if(HospitalName=="Apollo"){
            var string=JSON.stringify(transferObj)
            console.log("string in apollo========================>",string)
            var endpoint =nem.model.objects.create("endpoint")("http://b1.nem.foundation", "7895");    
            // Create a common object holding key
            var common = nem.model.objects.create("common")("123","cf07b9b0d72a0320aea551c67e994729284b044dd7f9ccea9612762f4e988d4e");
            
            // Create an un-prepared transfer transaction object
           
                var transferTransaction = nem.model.objects.create("transferTransaction")(addressofProvider2, 0,string);
            // Prepare the transfer transaction object
            var transactionEntity = nem.model.transactions.prepare("transferTransaction")(common, transferTransaction, nem.model.network.data.mijin.id);
            
            //Serialize transfer transaction and announce
              var ee=  await nem.model.transactions.send(common, transactionEntity, endpoint)
                console.log("eeeeeeeeeeeeeeeeeeeeeeeeee==========================>",ee)
                var data  = new Tpa({
                    "patientData":result[i]._doc.patientData,
                    "HospitalName":result[i]._doc.HospitalName,
                    "status":"Auto approved",
                    "submitID":submitID,
                    "txHash":ee.transactionHash.data,
                    "rapidID":rapidID,
                    "previousHashes":[],
                    "message":"Payment process initiated",
                    "Expenses":result[i].TotalClaimedAmount,
                    "AmountPayerWouldPay":result[i]._doc.TotalClaimedAmount*0.8,
                    "AmountuserHavetopay":result[i]._doc.TotalClaimedAmount*0.2,
                      created_at: new Date()
                    });
                 data.save()
            resolve(patientData.remove({_id:result[i].id}))
           
        }
    }
    //===========================if patients data is 10% more than preproposed amount============================================================//
    if(result[i].TotalClaimedAmount<=file.CoverageAmt && ((result[i].TotalClaimedAmount)<=(file.preproposedAmt+file.preproposedAmt*0.1))&&(result[i].TotalClaimedAmount>file.preproposedAmt)){
    console.log("if the amt is greater but less than 10%",result[i].TotalClaimedAmount<=file.CoverageAmt && ((result[i].TotalClaimedAmount)<=(file.preproposedAmt+file.preproposedAmt*0.1))&&(result[i].TotalClaimedAmount>file.preproposedAmt))
      
        if(HospitalName=="Fortis"){
        var data  = new Tpa({
            "patientData":result[i]._doc.patientData,
            "status":"Waiting for Tpa approval(24hr)",
            "HospitalName":result[i]._doc.HospitalName,
            "submitID":submitID,
            "txHash":"",
            "rapidID":rapidID,
            "previousHashes":[],
            "message":"",
            "Expenses":result[i].TotalClaimedAmount,
            "AmountPayerWouldPay":file.preproposedAmt*0.8,
            "AmountuserHavetopay":file.preproposedAmt*0.2+(result[i]._doc.TotalClaimedAmount-file.preproposedAmt),
          
              created_at: new Date()
            });
            data.save()
            .then(() => (console.log("saved in tpa schema")))
            .catch(err => {
                if (err.code == 11000) {
                        console.log("duplicate data not feed to db")
                }})
    
                resolve(patientData.remove({_id:result[i].id}))    
        console.log("removed patient data from pateint data schema and moved to tpa schema for tpas approval")
            
        }   
        if(HospitalName=="Apollo"){
            var data  = new Tpa({
                "patientData":result[i]._doc.patientData,
                "HospitalName":result[i]._doc.HospitalName,
                "status":"Waiting for Tpa approval(24hr)",
                "submitID":submitID,
                "txHash":"",
                "rapidID":rapidID,
                "previousHashes":[],
                "message":"",
                "Expenses":result[i].TotalClaimedAmount,
                "AmountPayerWouldPay":file.preproposedAmt,
            "AmountuserHavetopay":(result[i]._doc.TotalClaimedAmount-file.preproposedAmt),
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
       
          if(result[i].TotalClaimedAmount<=file.CoverageAmt && (result[i].TotalClaimedAmount >file.preproposedAmt)){
              console.log("when amount is way out of range",(result[i].TotalClaimedAmount<=file.CoverageAmt && (result[i].TotalClaimedAmount >file.preproposedAmt)))
              if(HospitalName=="Fortis"){
            var data  = new Tpa({
                "patientData":result[i]._doc.patientData,
                "status":"Waiting for Tpa approval",
                "HospitalName":result[i]._doc.HospitalName,
                "txHash":"",
                "submitID":submitID,
                "rapidID":rapidID,
                "previousHashes":[],
                "message":"",
                "Expenses":result[i].TotalClaimedAmount,
                "AmountPayerWouldPay":file.preproposedAmt*0.8,
                "AmountuserHavetopay":file.preproposedAmt*0.2+(result[i]._doc.TotalClaimedAmount-file.preproposedAmt),
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
        "submitID":submitID,
        "txHash":"",
        "rapidID":rapidID,
        "previousHashes":[],
        "message":"",
        "Expenses":result[i].TotalClaimedAmount,
        "AmountPayerWouldPay":file.preproposedAmt,
        "AmountuserHavetopay":(result[i]._doc.TotalClaimedAmount-file.preproposedAmt),
          created_at: new Date()
        });
        data.save()
        .then(() => (console.log("saved in tpa schema")))
        .catch(err =>{
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
        
