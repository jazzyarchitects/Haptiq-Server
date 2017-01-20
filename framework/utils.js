'use strict';

const fs = require('fs');
const path = require('path');

let walk = function (moduleDirectory, walkDirectory, callback) {
  if (!callback) {
    callback = requireFromModule;
  }
  fs.readdirSync(moduleDirectory).forEach(function (dir) {
    let dirPath = path.join(moduleDirectory, dir);
    let dirStat = fs.statSync(dirPath);
    if (dirStat.isDirectory()) {
      let walkPath = path.join(dirPath, walkDirectory);
      fs.readdirSync(walkPath).forEach(function (file) {
        let filePath = path.join(walkPath, file);
        let fileStat = fs.statSync(filePath);
        if (fileStat.isFile() && /(.*)\.(js)$/.test(file)) {
          let modulePath = path.join(dirPath, walkDirectory, file);
          callback(modulePath);
        }
      });
    }
  });
};

let requireFromModule = function (filePath, callback) {
  module.paths.push('./modules');
  if (!callback) {
    callback = require;
  }
  return callback(filePath);
};

let successJSON = function (data) {
  return {success: true, data: data};
};

let errorJSON = function (errorCode, description, message) {
  if (arguments.length === 2) {
    message = description;
    description = undefined;
  }
  return {
    success: false,
    error: true,
    errorCode: errorCode || 500,
    description: description || "INTERNAL_USE_ONLY",
    message: message
  };
};

let printRoutes = function (router, outputFileName, isNotApi) {
  if (!fs.existsSync(path.join(process.cwd(), "tmp"))) {
    fs.mkdir(path.join(process.cwd(), "tmp"));
  }
  if (!fs.existsSync(path.join(process.cwd(), "tmp", "routes"))) {
    fs.mkdir(path.join(process.cwd(), "tmp", "routes"));
  }
  if (process.env.NODE_ENV === "development" || !process.env.NODE_ENV) {
    fs.writeFileSync(path.join(__dirname, '..', 'tmp', 'routes', ((isNotApi ? '' : 'api-') + (outputFileName || 'routes.json'))), JSON.stringify(router.stack), 'utf-8')
  };
};

exports.walk = walk;
exports.requireFromModule = requireFromModule;
exports.successJSON = successJSON;
exports.errorJSON = errorJSON;
exports.printRoutes = printRoutes;
