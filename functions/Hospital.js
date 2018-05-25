
const nem = require("nem-sdk").default;
const crypto= require("crypto");
var Tpa = require('../models/Tpa');
exports.DashBoard=(HospitalName)=>{
return new Promise(async(resolve,reject)=>{
    var aprovedArray=[];
   var results= await Tpa.find({"HospitalName":HospitalName})
        for(let i=0;i<results.length;i++ ){
            var str=JSON.stringify(results[i]._doc.patientData);         
            var txHash=results[i]._doc.txHash;
            if(txHash==""){
        console.log("empty hash")
        aprovedArray.push(results[i])
            }else{
            console.log(txHash)
            var searchEnabledEndpoint = nem.model.objects.create("endpoint")(nem.model.nodes.searchOnMijin[0].uri, nem.model.nodes.mijinPort);
            var res=await nem.com.requests.transaction.byHash(searchEnabledEndpoint,txHash )
                
                var fmt = nem.utils.format.hexToUtf8(res.transaction.message.payload);
                console.log("fmt===============>",fmt)
                var txObj=JSON.parse(fmt)
            const rapidID = crypto.createHash('sha256').update(str).digest('base64');
            if(txObj.rapidID==rapidID){
                console.log("data is not tampered")
            aprovedArray.push(results[i])
            }else{
                console.log("data is tampered")
                results[i].message="data is tampered"
                aprovedArray.push(results[i])
            }
            if(i==results.length-1){
            console.log(i==results.length-1)
            console.log("approved Array================>",aprovedArray)
           return resolve({
                "status":200,
                "message":aprovedArray
            })
        }
    }
    }
         
        resolve({"status":200,
        "message":aprovedArray})
        
        

})

}