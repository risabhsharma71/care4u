var nem = require("nem-sdk").default;

// Create an NIS endpoint object
var endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultMijin, nem.model.nodes.mijinPort);

// Address we'll use in some queries
var address = "MCXP3JJP62JU2GCNX6HPUWW2QYNLS5SPTCDRPHDA";
var txhash;
//Get all transactions of account
function hello(){
nem.com.requests.account.transactions.all(endpoint, address,txhash).then(function(res) {
    for(let a=0;a<res.data.length-1;a++){

        var msg =res.data[a].transaction.message.payload
        var fmt = nem.utils.format.hexToUtf8(msg);
        console.log(fmt)
    txhash = (res.data[res.data.length-1].meta.hash.data)
    }
    if(res.data.length != 0){
        hello()
    }
}, function(err) {
	console.error(err);
});
}
hello()


var crypto= require("crypto")
var rapidID
patientData=[{"patientdetails":{"dsdas":"dadads",
  "qwqwqw":"qwqw",
  "asdas":"dadada"
}},
{"Treatment":{"adada":"adada","qwqwq":"qwqwqw"}}]

var strings=JSON.stringify(patientData)
console.log(strings)
rapidID = crypto.createHash('sha256').update(strings).digest('base64');
console.log(rapidID)
