

'use strict';



var crypto = require('crypto');
var fs = require('fs');
var cors = require('cors');
const nem = require("nem-sdk").default;
const tpaNem= require("./functions/tpanem")
var tpaApproval=require("./functions/Tpaapproval.js")
const register = require('./functions/register');
 const contractJs = require('./functions/contract');
 const fetchcontract = require('./functions/getcontracts');
 const payer=require("./functions/payer");
 const mockWeather = require('./functions/mockWeather');
var user = require('./models/accounts');
var config = require('./config.json')
//==============================================mock services========================================//
module.exports = router => {
router.post('/mock',cors(),function(req,res){
    console.log(req.body);
    res.send({message:"mock mock"})

}
)
//=================================registerUser===================================================================//
router.get('/', (req, res) => res.end('Welcome to para-ins!'));

router.post('/registerUser', cors(),function(req,res)
{

const walletName = req.body.walletName;
// Set a password
const password = "123";
// Create PRNG wallet
const nem_id = nem.model.wallet.createPRNG(walletName, password, nem.model.network.data.mijin.id);

var endpoint =nem.model.objects.create("endpoint")("http://b1.nem.foundation", "7895");
// Create a common object
 var common = nem.model.objects.create("common")(password, "");

// // // Get the wallet account to decrypt

 var walletAccount = nem_id.accounts[0];

// // Decrypt account private key 
 nem.crypto.helpers.passwordToPrivatekey(common, walletAccount, "pass:bip32");

// // The common object now has a private key
 console.log("my private key :"+ JSON.stringify(common.privateKey))
 const privateKey = common.privateKey;


            register.registerUser(nem_id,privateKey)

            .then(result => {
                
        
                        res.status(result.status).json({
                            message: result.message
                          
                        });
    
                    })
                    .catch(err => res.status(err.status).json({message: err.message}).json({status: err.status}));
            
        });
//=============================================create discharge summary==============================================================//
        router.post('/createContract', cors(),function(req,res){
                         const i =1;
        var conditions ={"PATEINT_DETAILS":req.body.PATEINT_DETAILS,
                        "Treatment":req.body.Treatment,
                        "Package_details":req.body.Package_details,
                        "TotalClaimedAmount":req.body.TotalClaimedAmount};
                        var HospitalName=req.body.HospitalName
                        var status = req.body.status;
        
             console.log(conditions,status);
         
             contractJs.createContract(conditions,HospitalName,status)
             .then(result => {
                
        
                        res.status(result.status).json({
                            message: result.message
                          
                        });
    
                    })
                    .catch(err => res.status(err.status).json({
                        message: err.message
                    }))
                });

//============================================mock weather====================================================//         
router.get('/trigger',cors(),function(req,res){


    var jsonfile = require('jsonfile')
    var file = './payer_provider.json'
    jsonfile.readFile(file, function(err, obj)
    {
     if(err){
        res.send({"code":404,
        "message":"no contract created yet",
            "error":err})
         }    

   
             mockWeather.mock(obj)
             .then(result => {
                        console.log(result)
                        res.status(result.status).json({
                         message: "conditions satisfied for the users below"
                        });
    
                    }) .catch(err => res.status(err.status).json({
                        message: err.message
                    }))
                })
               
                   
                });
    
            

//==========================Tpa=====================================================================//
router.get('/Tpa',cors(),function(req,res){
   
        tpaApproval.mock()
             .then(result => {
                        console.log(result)
                        res.status(result.status).json({
                            patients:result.patients 
                        });
    
                    }) .catch(err => res.status(err.status).json({
                        message: err.message
                    }))
                });
            
//===========================tpa changing status=========================================================//
router.post('/Tpaupdate',cors(),function(req,res){
   var status= req.body.status;
   var id=req.body.id;

    tpaNem.mocknem(status,id)
         .then(result => {
                    console.log(result)
                    res.status(result.status).json({
                        message:result.message 
                    });
                }) .catch(err => res.status(err.status).json({
                    message: err.message
                }))
            });
        
//====================================payer page=============================================//
router.get('/payerpay',cors(),function(req,res){
   
    payer.mock()
         .then(result => {
                    console.log(result)
                    res.status(result.status).json({
                        message:result.message 
                    });

                }) .catch(err => res.status(err.status).json({
                    message: err.message
                }))
            });

        }