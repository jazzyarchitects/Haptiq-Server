'use strict';

const express = require('express');
const utils = require('./utils');
const fs = require('fs');
const path = require('path');
const routes = require('./routes');
const Log = require('jlogger');

const moduleDir = path.join(__dirname, '..', 'modules');

const admin = require('firebase-admin');
const fireBaseConfig = require(path.join(__dirname, '..', '..', 'firebase-config'));

global.requireFromModule = utils.requireFromModule;
global.successJSON = utils.successJSON;
global.errorJSON = utils.errorJSON;
global.printRoutes = utils.printRoutes;

let connection;
console.log('Hello!!!');

module.exports = function(config) {
  global.app = express();
  global.Log = Log;
  require('./express')(app);

  app.set('jwtsecret', config.secret.jwt);

  Log.setGlobalConfig({
    tagBold: true,
  });

  Log.hr();

  // connectDb();
  setGlobals();
  // bootstrapModels();
  bootstrapRoutes();

  //Connect to the database with given db url and options
  function connectDb() {
    // mongoose.Promise = global.Promise;
    // mongoose.connect(config.db.uri, config.db.options, function(){
    //     Log.i("Mongoose Connection", "MongoDB connected");
    // });
  }

  function bootstrapModels() {
    const dir = 'models';
    utils.walk(moduleDir, dir);
  }

  function bootstrapRoutes() {
    clearRoutes();
    routes(app);
    if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
      processRoutes();
    }
  }

  function clearRoutes() {
    const routesPath = path.join('.', 'tmp', 'routes');
    if (!fs.existsSync(routesPath)) {
      return;
    }
    fs.readdirSync(routesPath).forEach((file, i) => {
      if (fs.existsSync(path.join(routesPath, file))) {
        fs.unlinkSync(path.join(routesPath, file));
      }
    });
  }

  // function setupFirebase(){
  //     admin.initializeApp({
  //         credential: admin.credential.cert(fireBaseConfig),
  //         database: "https://haptiq-e8186.firebaseio.com"
  //     });
  // }

  // setupFirebase();

  function processRoutes(dir) {
    let dirName = dir || './tmp/routes/';
    let string = '';
    fs.readdir(dirName, function(err, fileNames) {
      if (err) {
        fs.mkdirSync(dirName);
        return processRoutes(dir);
        Log.e('ProcessRoutes', 'Error in storing routes');
      } else {
        Log.w('ProcessRoutes', 'FileNames: ' + JSON.stringify(fileNames));
        fileNames.forEach(function(fileName) {
          fs.readFile(dirName + fileName, 'utf-8', function(err, content) {
            if (fileName == fileNames[fileNames.length - 1]) {
              string += '{"' + fileName + '":' + content + '}';
              fs.writeFileSync('./tmp/routesRaw.json', '{"routes":[' + string + ']}', 'utf-8');
              extractRoutes();
            } else {
              string += '{"' + fileName + '":' + content + '},';
            }
          });
        });
      }
    });
  }

  function setGlobals() {
    let jgenconfig = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'jgenconfig.json')).toString());
    global.jgenConfig = jgenconfig;
  }

  function extractRoutes() {
    fs.readFile('./tmp/routesRaw.json', function(err, string) {
      const file = JSON.parse(string);
      let content = file.routes;

      let html =
        '<!DOCTYPE html><html lang="en"><head>' +
        '<meta charset="UTF-8">' +
        '<title>Routes</title>' +
        '</head>' +
        '<body><div style="border: 1px #000 solid; width: 60%; margin: auto; padding: 5px;">' +
        "<table width='100%' style='text-align: center;'>" +
        '<tr>' +
        '<th>Prefix</th>' +
        '<th>Path</th>' +
        '<th>Methods</th>' +
        '</tr>';

      content.forEach(function(jsonObject) {
        let key = Object.keys(jsonObject)[0];
        let innerArray = jsonObject[key];
        html +=
          '<tr><td colspan="3">&nbsp;<hr /></td></tr><tr style="border: #000000 2px solid;"><td>/' +
          key.replace('Routes.json', '').replace('-', '/') +
          '</td></tr>';
        innerArray.forEach(function(jObj) {
          if (jObj.route) {
            let route = jObj.route;
            let path = route.path;
            let stack = route.stack;
            html += '<tr><td></td><td>' + path + '</td>';
            let methods = [];
            stack.forEach(function(stackObject) {
              if (stackObject.name == '<anonymous>') {
                methods.push(stackObject.method);
              }
            });
            html += '<td>' + methods + '</td></tr>';
          }
        });
      });

      html += '</table></div></body></html>';
      fs.writeFileSync('./tmp/routes.html', html);
    });
  }

  return app;
};
