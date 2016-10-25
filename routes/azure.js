var azure_asm_compute = require('azure-asm-compute');
var azure_rm_compute = require('azure-arm-compute');
var azure_common = require('azure-common');
var configAuth = require('./models/credentials');

var service_name = "assignment2";

module.exports = function () {

   /*var compute_client_asm = azure_asm_compute.createComputeManagementClient(
        new azure_common.CertificateCloudCredentials({
        subscriptionId: configAuth.azure.subscription_id,
        pem: configAuth.azure.pem
    }));*/

   /* var compute_client_arm = new azure_rm_compute(
        new azure_common.CertificateCloudCredentials({
        subscriptionId: configAuth.azure.subscription_id,
        pem: configAuth.azure.pem
    }),configAuth.azure.subscription_id);*/

    //compute_client_arm.virtualMachineScaleSets.beginCreateOrUpdate();
   /* compute_client_arm.virtualMachineScaleSets.listAll(function (err, result) {
        console.log(result);
    });*/
    //VirtualMachineScaleSet scale_sets = new

    /*computeManagementClient.virtualMachineVMImages.list(
        function (err, result) {
            if (err) {
                console.error(err);
            } else {
                console.info(result);
            }
        }
    );*/
};