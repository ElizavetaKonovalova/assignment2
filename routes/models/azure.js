var azure_compute = require('azure-asm-compute');
var azure_common = require('azure-common');
var configAuth = require('./credentials');

module.exports = function () {

    var computeManagementClient = azure_compute.createComputeManagementClient(
        new azure_common.CertificateCloudCredentials({
        subscriptionId: configAuth.azure.subscription_id,
        pem: configAuth.azure.pem
    }));

    computeManagementClient.virtualMachineVMImages.list(
        function (err, result) {
            if (err) {
                console.error(err);
            } else {
                console.info(result);
            }
        }
    );
};