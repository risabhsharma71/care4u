var Tpa = require('../models/Tpa')

exports.mock=()=>{
    return new Promise(async(resolve,reject)=>{
       
        Tpa.find( { $or:[ {'status':"Waiting for Tpa approval(24hr)"}, {'status':"Waiting for Tpa approval"} ]}).then(result=>{
            console.log(result)
            resolve({"status":200,
        "patients":result})
                     })
        
    })
}