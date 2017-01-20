"use strict";

const fs = require('fs');
const path = require('path');
const express = require('express');
const apiAuthentication = require('jgen').APIAuthentication;

module.exports = function(app){

  let apiRouter = express.Router();
  let router = express.Router();


  let moduleDirectory = path.join(__dirname, '..', "./modules");
  fs.readdirSync(moduleDirectory).forEach(function(model){
    let routesPath = path.join(moduleDirectory, model, 'routes.js');
    let stats = fs.statSync(path.join(moduleDirectory, model));
    if(!stats.isDirectory()){
      return;
    }
    if(fs.existsSync(routesPath)){
      if(jgenConfig.apiModels.indexOf(model)!==-1){
        require(routesPath)(apiRouter);
      }else{
        require(routesPath)(router);
      }
    }
    let routesFolder = path.join(moduleDirectory, model, "routes");
    if(fs.existsSync(routesFolder)){
      fs.readdirSync(routesFolder).forEach(function(file){
        let st = fs.statSync(path.join(routesFolder, file));
        if(st.isFile()){
          if(jgenConfig.apiModels.indexOf(model)!==-1){
            require(path.join(routesFolder, file))(apiRouter);
          }else{
            require(path.join(routesFolder, file))(router);
          }
        }
      });
    }
  });

  app.use('/', router);
  app.use('/api', apiRouter);


}
