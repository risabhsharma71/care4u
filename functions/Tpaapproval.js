var Tpa = require('../models/Tpa')

exports.mock=()=>{
    return new Promise(async(resolve,reject)=>{
       
        Tpa.find( { $or:[ {'status':"Waiting for Tpa approval(24hr)"}, {'status':"Waiting for Tpa approval"},{"status":"rejected"},{"status":"Auto approved"},{"status":"Approved"}]}).then(result=>{
            console.log(result)
            resolve({"status":200,
        "patients":result})
                     })
        
    })
}