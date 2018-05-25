
const nem = require("nem-sdk").default;
const crypto= require("crypto");
var Tpa = require('../models/Tpa');

exports.history=(id)=>{
    return new Promise(async(resolve,reject)=>{
    var historyArray=[];
    let results= await  Tpa.findById({_id:id})
    var ids=results._doc.previousHashes

    if(ids.length==0){
        return resolve({
            status:200,
            "message":"no history for this patient"
        })
    }

    for(let i=0;i<ids.length;i++){
        var searchEnabledEndpoint = nem.model.objects.create("endpoint")(nem.model.nodes.searchOnMijin[0].uri, nem.model.nodes.mijinPort);
var res=await nem.com.requests.transaction.byHash(searchEnabledEndpoint, ids[i])
    
    var fmt = nem.utils.format.hexToUtf8(res.transaction.message.payload);
        var txObj=JSON.parse(fmt)
           var mongoId=txObj.id
            var check = await Tpa.findById({_id:mongoId})

         var str=  JSON.stringify(check._doc.patientData)

        const rapidID = crypto.createHash('sha256').update(str).digest('base64');
                if(rapidID===txObj.rapidID){
                    console.log("data is not tappered")
                    historyArray.push(txObj)

                }else{
                    console.log("data is tampered")
                    historyArray.push({"mongoId":results,
                                    "message":"data is tampered"})
                }
                if(i==ids.length-1){
                    return resolve({"status":200,
                "message":historyArray})
                }
    }
})
}

