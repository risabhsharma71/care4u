   var Tpa = require("../models/Tpa");
   const nem = require("nem-sdk").default;

   exports.oneday=()=>{
        return new Promise(async(resolve,reject)=>{
        let onedaytrigger= await Tpa.find({status:"Waiting for Tpa approval(24hr)"})
        if(onedaytrigger.length==0){
            resolve({"status":200,
            "message":"dataset completed waiting for new dataset"})
        }
     for(let a=0;a<onedaytrigger.length;a++){
         var HospitalName=onedaytrigger[a]._doc.HospitalName;
         var createdDate= (onedaytrigger[a]._doc.created_at);
var dd = createdDate.getDate();
var mm = createdDate.getMonth()+1; //January is 0!
var yyyy = createdDate.getFullYear();
    var issuedDate=dd+"/"+mm+"/"+yyyy
         var date =new Date();
         var dd1 = date.getDate();
var mm1 = date.getMonth()+1; //January is 0!
var yyyy1 = date.getFullYear();
      var todaysDate=  dd1+"/"+mm1+"/"+yyyy1
      console.log(issuedDate==todaysDate)
      console.log("issueddate",issuedDate);
      console.log("todaysdate",todaysDate) 
      if(issuedDate==todaysDate){
             resolve({"status":200,
             "message":"sameday policy will be updated after a day"});
         }else{
            var AddressOfProvider
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
           
            var transferTransaction = nem.model.objects.create("transferTransaction")(AddressOfProvider, 0,"automated process to pass the claim after 24hr");
            
            // Prepare the transfer transaction object
            var transactionEntity = nem.model.transactions.prepare("transferTransaction")(common, transferTransaction, nem.model.network.data.mijin.id);
            
            //Serialize transfer transaction and announce
            nem.model.transactions.send(common, transactionEntity, endpoint)

            let tpaoneday=await Tpa.findByIdAndUpdate({_id:onedaytrigger[a].id},{ $set: { "status":"approved"} }, { new: true })
            Tpa.findByIdAndUpdate({_id:onedaytrigger[a].id},{ $set: { "status":"approved"} }, { new: true }).then(reports=>{
                console.log("reports");
            })
        }
         
       
    }
    resolve({"status":200,
"message":"triggered 24hrs function"})

   
    })
    
   }
   