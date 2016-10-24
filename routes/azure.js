var azure_asm_compute = require('azure-asm-compute');
var azure_arm_compute = require('azure-arm-compute');
var azure_common = require('azure-common');
var configAuth = require('./models/credentials');

var service_name = "assignment2";

module.exports = function () {

    var computeManagementClient = azure_asm_compute.createComputeManagementClient(
        new azure_common.CertificateCloudCredentials({
        subscriptionId: configAuth.azure.subscription_id,
        pem: configAuth.azure.pem
    }));

    //var scale_set = new VirtualMachineScaleSet(computeManagementClient);

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