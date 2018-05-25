
const nem = require("nem-sdk").default;
const crypto= require("crypto")
var patientData= require("../models/patientData");
var Tpa = require('../models/Tpa');

exports.mock=()=>{
    return new Promise(async(resolve,reject)=>{
        var aprovedArray=[];
    let results1= await  Tpa.find({})
        for(let i=0;i<results1.length;i++ ){
            var str=JSON.stringify(results1[i]._doc.patientData);         
            var txHash=results1[i]._doc.txHash;
            console.log(txHash)
            if(txHash==""){
                aprovedArray.push(results1[i])
            }
            else{
            var searchEnabledEndpoint = nem.model.objects.create("endpoint")(nem.model.nodes.searchOnMijin[0].uri, nem.model.nodes.mijinPort);
            var res=await nem.com.requests.transaction.byHash(searchEnabledEndpoint,txHash )
                
                var fmt = nem.utils.format.hexToUtf8(res.transaction.message.payload);
                var txObj=JSON.parse(fmt)
            const rapidID = crypto.createHash('sha256').update(str).digest('base64');
            if(txObj.rapidID==rapidID){
                console.log("data is not tampered")
            aprovedArray.push(results1[i])
            }else{
                console.log("data is tampered")
                results1[i].message="data is tampered"
                aprovedArray.push(results1[i])
            }
        }
            if(i==results1.length-1)
           return resolve({
                "status":200,
                "message":aprovedArray
            })
        }
           
    })
}