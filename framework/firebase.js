"use strict";
const path = require('path');
const request = require('request');
const config = require(path.join(__dirname, '..', 'config'));

const FCM_URL = "https://fcm.googleapis.com/fcm/send";

let sendMessage = function(recipients, data){
  if(!recipients){
    recipients = "dhfbskjfnsdk";
  }

  request({
    method: 'POST',
    url: FCM_URL,
    headers: {
      'Content-Type': "application/json",
      'Authorization': "key="+config.firebase.apiKey
    },
    body: JSON.stringify({
      data: data,
      to: recipients
    })
  }, (err, response, body)=>{
    // Log.i("Firebase: "+)
    console.log(response);
  });
}

if(require.main === module){
  sendMessage();
}
