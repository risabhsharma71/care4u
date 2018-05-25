

var Tpa = require('../models/Tpa')
var nem = require("nem-sdk").default;
var AddressOfProvider;

exports.mocknem=(status,id,message)=>{

    return new Promise((resolve,reject)=>{

        Tpa.find({ _id:id}).then(result=>{

            var report = result
            var HospitalName=report[0]._doc.HospitalName
            var rapidID= report[0]._doc.rapidID
            var submitID= report[0]._doc.submitID
            var transferObj={"id":id,
                "rapidID":rapidID,
        "submitID":submitID,
        "message":message,
        "status":status
    }
        var str=JSON.stringify(transferObj)
       
            if(status == "Rejected"){
                new Promise(async(resolve,reject)=>{
                if(HospitalName=="Apollo"){
                    AddressOfProvider="MALSD5RR7YN4YSFTQWOLJURZ2OINSME4GD5RBHZJ"
                }
                if(HospitalName=="Fortis"){
                    AddressOfProvider="MBAPHIOTSEORVR5DMJGVOCAWC2HE4PH2JTBVHTG2"   
                };
            
                var endpoint =nem.model.objects.create("endpoint")("http://b1.nem.foundation", "7895");    
                
                // Create a common object holding key
                
                var common = nem.model.objects.create("common")("123","cf07b9b0d72a0320aea551c67e994729284b044dd7f9ccea9612762f4e988d4e");
                
                // Create an un-prepared transfer transaction objecpatientst
               
                var transferTransaction = nem.model.objects.create("transferTransaction")(AddressOfProvider, 0,str);
                
                // Prepare the transfer transaction object
                var transactionEntity = nem.model.transactions.prepare("transferTransaction")(common, transferTransaction, nem.model.network.data.mijin.id);
                
                //Serialize transfer transaction and announce
                   var hee=await  nem.model.transactions.send(common, transactionEntity, endpoint)
    console.log("heeeeeeeeeeeeeeeeee================>",hee.transactionHash.data)
          var result =await (Tpa.findOneAndUpdate({ _id:id }, { $set: { "status":status,"message":message,"txHash":hee.transactionHash.data},$push:{"previousHashes":hee.transactionHash.data}},{new: true}))

                    console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhh================>",result)
                  return  resolve({"status":200,
                    "message":"rejected"})  
            
                })
                }
          
                
                if(status == "Approved"){
                 new Promise(async(resolve,reject)=>{
               
                    if(HospitalName=="Apollo"){
                        AddressOfProvider="MALSD5RR7YN4YSFTQWOLJURZ2OINSME4GD5RBHZJ"
                    }
                    if(HospitalName=="Fortis"){
                        AddressOfProvider="MBAPHIOTSEORVR5DMJGVOCAWC2HE4PH2JTBVHTG2"   
                    };
                
                    var endpoint =nem.model.objects.create("endpoint")("http://b1.nem.foundation", "7895");    
                    
                    // Create a common object holding key
                    
                    var common = nem.model.objects.create("common")("123","cf07b9b0d72a0320aea551c67e994729284b044dd7f9ccea9612762f4e988d4e");
                    
                    // Create an un-prepared transfer transaction objecpatientst
                   
                    var transferTransaction = nem.model.objects.create("transferTransaction")(AddressOfProvider, 0,str);
                    
                    // Prepare the transfer transaction object
                    var transactionEntity = nem.model.transactions.prepare("transferTransaction")(common, transferTransaction, nem.model.network.data.mijin.id);
                    
                    //Serialize transfer transaction and announce
                    var hee=await  nem.model.transactions.send(common, transactionEntity, endpoint)
                    console.log("heeeeeeeeeeeeeeeeee================>",hee.transactionHash.data)
                    var result1 =await (Tpa.findOneAndUpdate({ _id:id }, { $set: { "status":status,"message":message,"txHash":hee.transactionHash.data},$push:{"previousHashes":hee.transactionHash.data}},{new: true}))
                    
                     return   resolve({"status":200,
                        "message":"approved"})
                })
                    }
                  return  resolve({"status":200,
                "messsage":"object updated"})

                }).catch(err=>{console.log(err)})
            })
            }