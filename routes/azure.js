var azure = require('azure');
var adal = require('adal-node');
var configAuth = require('./models/credentials');
var json = require('json-query');
var fs = require('fs');

var deployment_parameters = {
    "properties": {
        "templateLink": {
            "uri": "https://storagefortemplate.blob.core.windows.net/templates/vmss_template.json",
            "contentVersion": "1.0.0.0"
        },
        "mode": "Incremental",
        "parametersLink": {
            "uri": "https://storagefortemplate.blob.core.windows.net/templates/vmss_parameters.json",
            "contentVersion": "1.0.0.0"
        },
        "debugSetting": {
            "detailLevel": "requestContent, responseContent"
        }
    }
};

module.exports = function () {
    getToken(tokenCallback);
};

function getToken (callback){
    
    // instantiate AD AuthContext with directory endpoint
    var authContext = new adal.AuthenticationContext('https://login.windows.net/' + configAuth.azure.tenantID);

    // get client access token from active directory
    authContext.acquireTokenWithClientCredentials('https://management.core.windows.net/',
        configAuth.azure.clientID,
        configAuth.azure.key,
        callback);
}

function tokenCallback(error, tokenResponse){
    if (error)
        return console.error('Token Error: ', error);

    // azure helper class for passing credentials
    var credentials = new azure.TokenCloudCredentials({
        subscriptionId: configAuth.azure.subscription_id,
        token: tokenResponse.accessToken
    });

    //Create clients for manipulating scale sets, resource groups, and virtual machines
    var client_rm = azure.createResourceManagementClient(credentials, configAuth.azure.subscription_id);
    var client_arm = azure.createARMComputeManagementClient(credentials, configAuth.azure.subscription_id);

    createResourceG(client_rm, client_arm);
}

/*
* Checks if a resource group exists. If not, create a new resource group
* and trigger function for creating a scale set.
* If exists, start creating scale sets.
* */
function createResourceG(client_rm, client_arm) {

    client_rm.resourceGroups.checkExistence("assignment2-rg", function (err, exist, request, response) {

        if(err) throw err;

        if(!exist) {
            client_rm.resourceGroups.createOrUpdate("assignment2-rg", {"name":"assignment2-rg", "location":"southcentralus"},
                function (err, result, request, response) {
                    if(err) throw err;

                    //Check if it's been created successfully
                    if(response.statusMessage == 'Created')
                        createScaleSets(client_rm, client_arm);
            });
        }
        else {
            createScaleSets(client_rm, client_arm);
        }
    });
}

/*
* Checks if a deployment with this name already exists. If not, create a new one.
* If exists, skip.
* */
function createScaleSets(client_rm, client_arm) {

    client_rm.deployments.checkExistence("assgnmnt2cc", "deployVMSS", function (err, exist, request, response) {
        if(err) throw err;

        if(!exist) {
            client_rm.deployments.createOrUpdate("assgnmnt2cc", "deployVMSS", deployment_parameters,
                function (err, result, request, response) {
                    if(err) throw err;

                    /*//Check if it's been created successfully
                    if(response.statusMessage == 'OK')
                        captureCurrentMachine(client_arm);*/
            });
        }
        else {
            // captureCurrentMachine(client_arm);
        }
    });
}
/*
function captureCurrentMachine(client_arm) {

    client_arm.virtualMachines.beginCapture("assignment2-rg", "vm01", function (err, result, request, response) {
        console.log(result);
        console.log("====================================\n\n\n\n\n\n\n\n/");
        console.log(response);
    });

    // client_arm.virtualMachineScaleSets.createOrUpdate()

    //client_arm.virtualMachineScaleSets

    client_arm.virtualMachineScaleSets.list("assignment2-rg", function (err, exist, request, response) {
        console.log(exist);
    });
}*/
