'use strict';


const hash = require('../models/contractHash');
const nem = require("nem-sdk").default;


exports.getcontract = ((i) =>{
   
   return new Promise((resolve, reject) => {

    hash.find({})
    .then((txHashOfContract) =>{
       console.log(txHashOfContract.length)
       var len = txHashOfContract.length;
        var hash =txHashOfContract[len-1]._doc.hash;
        console.log("hash from mongo",hash)

    var txHash = hash;
        // Create another endpoint because this request need special nodes
      var searchEnabledEndpoint = nem.model.objects.create("endpoint")(nem.model.nodes.searchOnMijin[0].uri, nem.model.nodes.mijinPort);
nem.com.requests.transaction.byHash(searchEnabledEndpoint, txHash).then(function(res) {
            console.log("entering nems get hash function");
            console.log("hexa decimal format of contract",res.transaction.message.payload);
           var BCcontract1 =nem.utils.format.hexToUtf8(res.transaction.message.payload)
            var BCcontract=JSON.parse(BCcontract1)
            console.log("contract received ffrom nem============================>",BCcontract);
       
                if(BCcontract!=0){
			
			resolve({
                        status: 200,
                        contract :BCcontract
                      
                    })
                 
                }else {
                
                  reject({
                       status: 402,
                       message: 'Profile of the user not built yet'
                                    });
                                }
                            })
                
            
            .catch(err => reject({
                message: 'Internal Server Error!'
            }));
        })

	})
    })

