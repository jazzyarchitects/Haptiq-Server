'use strict';
 const path = require('path');
 const rootPath = path.join(__dirname, "..");

 module.exports = {
     root: rootPath,
     db: {
          uri: "mongodb://127.0.0.1/Hackfest",
          options: {
             server: {
                socketOptions: {
                     keepAlive: 1
                 }
             }
         }
     },
     server: {
         port: Number(process.env.PORT || 3000)
     },
     secret:{
        jwt: "KC-)&DpEH@e9y6s109!d4VpTCo_V8N"
    },
    firebase: {
        apiKey: "AAAAIp9DcdA:APA91bEmSer9HJEADyJqkiTfaeKmzn-kz5ydk08wy8MGjSoBbKZJrBoqE-Dxf9-07jt4YH_0zIPzJfFarUnXxta9pGAi4yxPKlNPtCdqocd7QZHDKttIyyFJrtUTCbJ5tNsCXR5NSzUV",
        senderId: "148700885456"
    }
 };
