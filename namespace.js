var nem = require("nem-sdk").default;
var common = nem.model.objects.create("common")("","8de216c125beb4d25d484919ad5168b67a3274dc9746e0d42d94f409a756ae7b");
var endpoint = nem.model.objects.create("endpoint")('http://b1.nem.foundation', nem.model.nodes.mijinPort);

var tx = nem.model.objects.create("namespaceProvisionTransaction")("testrisabh", "");

//2- Prepare the tx
var entity = nem.model.transactions.prepare("namespaceProvisionTransaction")(common, tx, nem.model.network.data.mijin.id);

//3- Send
var sending=nem.model.transactions.send(common, entity, endpoint);
console.log("sending=-============>",sending)

// Get namespaces owned by account
nem.com.requests.account.namespaces.owned(endpoint, "MCXP3JJP62JU2GCNX6HPUWW2QYNLS5SPTCDRPHDA").then(function(res) {
	console.log("\nNamespaces of account:");
	console.log(res);
}, function(err) {
	console.error(err);
});