'use strict';

const path = require('path');
const request = require('request');

const config = require(path.join(__dirname, '..', 'config'));

const FCM_URL = 'https://fcm.googleapis.com/fcm/send';

const admin = require('firebase-admin');
let firebaseConfigPath = path.join(__dirname, '..', 'config', 'firebase.json');
if (process.env.NODE_ENV === 'production') {
  firebaseConfigPath = path.join(__dirname, '..', '..', 'firebase-config.json');
}
const fireBaseConfig = require(firebaseConfigPath);

admin.initializeApp({
  credential: admin.credential.cert(fireBaseConfig),
  database: 'https://haptiq-9816a.firebaseio.com',
});

let sendMessage = function(recipients, data) {
  console.log('Sending firebase message', recipients, data);
  if (!recipients) {
    recipients = 'dhfbskjfnsdk';
  }

  if (!Array.isArray(recipients)) {
    recipients = [recipients];
  }

  admin
    .messaging()
    .sendToDevice(recipients, { data })
    .then(response => {
      console.log('firebase response', response);
    })
    .catch(err => {
      console.log('firebase error', err);
    });

  // request(
  //   {
  //     method: 'POST',
  //     uri: FCM_URL,
  //     headers: {
  //       Authorization: 'key=' + config.firebase.apiKey,
  //     },
  //     json: {
  //       registration_ids: recipients,
  //       priority: 'high',
  //       data: data,
  //     },
  //   },
  //   (err, response, body) => {
  //     Log.i('Firebase: ');
  //     console.log(response.statusCode);
  //     console.log(body);
  //   },
  // );
};

if (require.main === module) {
  sendMessage();
}

exports.sendMessage = sendMessage;
