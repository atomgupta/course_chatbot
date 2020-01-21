'use strict'
 
const dialogflow=require('dialogflow')
const config=require('../config/keys')
const structjson=require('structjson')
const mongoose=require('mongoose')
const projectID=config.googleProjectID;
const credentials={
    client_email:config.googleClientEmail,
    private_key:config.googlePrivateKey
};
const sessionClient=new dialogflow.SessionsClient({projectID,credentials});

const Registration=mongoose.model('registration')
module.exports={
    textQuery:async function(text,userID,parameters={}){
        const sessionPath=sessionClient.sessionPath(config.googleProjectID,config.dialogFlowSessionID+userID)
        let self=module.exports;
        // console.log(self)
        const request = {
            session: sessionPath,
            queryInput: {
              text: {
                text:text,
                languageCode: config.dialogFlowSessionLanguageCode,
              },
            },
            queryParams:{
                payload:{
                    data:parameters
                }
            }
          };
          let responses= await sessionClient
          .detectIntent(request);
          responses=await self.handleAction(responses)
        return responses;

    },
    eventQuery: async function(event,userID, parameters = {}) {
        const sessionPath=sessionClient.sessionPath(config.googleProjectID,config.dialogFlowSessionID+userID)
        let self = module.exports;
        const request = {
            session: sessionPath,
            queryInput: {
                event: {
                    name: event,
                    parameters: structjson.jsonToStructProto(parameters), //Dialogflow's v2 API uses gRPC. You'll need a jsonToStructProto method to convert your JavaScript object to a proto struct.
                    languageCode: config.dialogFlowSessionLanguageCode,
                },
            }
        };

        let responses = await sessionClient.detectIntent(request);
        responses = await self.handleAction(responses);
        return responses;
    },
   
    handleAction:function(responses){
        let self=module.exports
        let queryResult = responses[0].queryResult;

        switch (queryResult.action) {
            case 'recommendcourses-yes':
                if (queryResult.allRequiredParamsPresent) {
                    // console.log(queryResult)
                           self.saveRegistration(queryResult.parameters.fields)
                }
                break;
        }
        return responses;
    },
    saveRegistration: async function(fields){
        // console.log(fields)
        const registration = new Registration({
            name: fields.name.stringValue,
            address: fields.address.stringValue,
            phone: fields.phone.stringValue,
            email: fields.email.stringValue,
            dateSent: Date.now()
        });
        try{
            let reg = await registration.save();
            console.log(reg);
        } catch (err){
            console.log(err);
        }
    }
}