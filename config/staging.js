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
        jwt: "~7)EL%SLG(n6%xnRB8Ll^3iKBklrHT"     }
 };
