
var Tpa=require("../models/Tpa")

exports.DashBoard=(HospitalName)=>{
return new Promise((resolve,reject)=>{
    Tpa.find({"HospitalName":HospitalName}).then(results=>{
        console.log(results)
        resolve({"status":200,
        "Patients":results})
        
        })

})

}