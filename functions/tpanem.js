

var Tpa = require('../models/Tpa')
var nem = require("nem-sdk").default;
var AddressOfProvider;

exports.mocknem=(status,id)=>{

    return new Promise(async(resolve,reject)=>{
        console.log("id===============>",id)
        console.log("status==========================>",status)
        Tpa.findOneAndUpdate({ _id:id }, { $set: { "status":status} }, { new: true }).then(result=>{
         
            if(status == "rejected"){
                return resolve({"status":200,
            "message":"status rejected"})
            }
            var report = (result);
         
            var HospitalName=report.HospitalName
            if(HospitalName=="Apollo"){
                AddressOfProvider="MAN3JN6GBWNT5XJOND5BEYG4SQRR2B6YJ3BSU6PR"
            }
            if(HospitalName=="Fortis"){
                AddressOfProvider="MDQ52TVBHGD5HAQF2NL27WPVS5I7JZ7KQXF4FDAS"   
            };
        
            var endpoint =nem.model.objects.create("endpoint")("http://b1.nem.foundation", "7895");    
            // Create a common object holding key
            var common = nem.model.objects.create("common")("123","8de216c125beb4d25d484919ad5168b67a3274dc9746e0d42d94f409a756ae7b");
            
            // Create an un-prepared transfer transaction objecpatientst
           
            var transferTransaction = nem.model.objects.create("transferTransaction")(AddressOfProvider, 0,"Approved by tpa");
            
            // Prepare the transfer transaction object
            var transactionEntity = nem.model.transactions.prepare("transferTransaction")(common, transferTransaction, nem.model.network.data.mijin.id);
            
            //Serialize transfer transaction and announce
               var hee= nem.model.transactions.send(common, transactionEntity, endpoint)
            console.log("nem==============>",hee)
                resolve({"status":200,
                "message":"status approved"})
                })
   
         
        })
            
           
}