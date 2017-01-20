"use strict";

const path = require('path');
const request = require('request');

const config = require(path.join(__dirname, '..', 'config'));

const FCM_URL = "https://fcm.googleapis.com/fcm/send";


let sendMessage = function(recipients, data){
  if(!recipients){
    recipients = "dhfbskjfnsdk";
  }

  if(!Array.isArray(recipients)){
    recipients = [recipients];
  }

  request({
    method: 'POST',
    uri: FCM_URL,
    headers: {
      'Authorization': "key="+config.firebase.apiKey
    },
    json: {
      "registration_ids": recipients,
      'priority': 'high',
      'data': data

    }
  }, (err, response, body)=>{
    // Log.i("Firebase: "+)o
    // console.log(response.statusCode);
    // console.log(body);
  });
}

if(require.main === module){
  sendMessage();

}
