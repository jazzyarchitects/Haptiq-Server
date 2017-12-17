'use strict';

const config = require('./config');
const chalk = require('chalk');
const http = require('http');
const path = require('path');
const cluster = require('cluster');
const chokidar = require('chokidar');

let app = undefined;
let numWorkers = require('os').cpus().length;
let workerCount = 0;

const serverPort = config.server.port;

let ipAddr = 'localhost';
if (process.env.NODE_ENV === 'production') {
  ipAddr = 'localhost';
}

exports.start = isTest => {
  if (isTest === undefined) {
    config.db.uri = config.db.uri + '_test';
  }
  app = require('./framework/bootstrap')(config);

  let server = http.Server(app);
  require(path.join(__dirname, 'socketio'))(server);

  server.listen(serverPort, function() {
    console.log(chalk.red.bold('Server running at port: ' + serverPort));
  });

  process.on('message', function(message) {
    if (message.command === 'shutdown' && message.from === 'master') {
      process.exit(0);
    }
  });
};

exports.close = () => {
  app.close();
};

exports.start();

// process.on('unhandledRejection', (reason, p) => {
//   console.log(chalk.red("Unhandled Rejection at: Promise "), p, chalk.red(" reason: "), chalk.red(reason));
// });

// process.on('unhandledException', (error, m)=> {
//   console.log(chalk.red("Unhandled Exception at: Error "), m, chalk.red(" reason: "), chalk.red(error));
// })

// function createWorkers() {
//   if(workerCount<=0) {
//     return;
//   }else{
//     cluster.fork();
//     workerCount--;
//     setTimeout(createWorkers, 2*1000);
//   }
// }

// if(cluster.isMaster && (process.env.NODE_ENV==="production" || process.argv.indexOf("--force-cluster")!==-1)) {
//   // Watcher for no downtime updatation
//   chokidar.watch('.', {
//     ignored: ['tmp/*', 'public/*'],
//     persistent: true,
//     ignoreInitial: true,
//     cwd: '.',
//     depth: 99,
//     interval: 10000
//   }).on('all', restartWorkers);

//   if(numWorkers === 1) {
//     numWorkers *= 2;
//   }

//   console.log(chalk.yellow("Master setting up "+numWorkers+" workers"));
//   workerCount = numWorkers;

//   createWorkers();

//   cluster.on('online', (worker)=>{
//     console.log(chalk.magenta("Worker thread: "+worker.process.pid+" is online"));
//   });
//   cluster.on('exit', (worker, code, signal)=>{
//     console.log(chalk.red('Worker thread: '+worker.process.pid+" is exiting"));
//     cluster.fork();
//   });
// }else{
//   exports.start(false);
// }

// let workerIds = [];
// let appRestarting = false;

// function restartWorkers(event, path) {
//   if(appRestarting) {
//     return;
//   }
//   for(let wid in cluster.workers) {
//     workerIds.push(wid)
//   }
//   appRestarting = true;
//   setTimeout(()=>{
//     appRestarting = false;
//   }, numWorkers*1000*5);
//   stopWorker();
// }

// function stopWorker() {
//   if(workerIds.length<=0) {
//     return;
//   }
//   if(Object.keys(cluster.workers).length>0) {
//     let wid = workerIds.pop();
//     cluster.workers[wid].send({
//       command: 'shutdown',
//       from: 'master'
//     });
//     setTimeout(()=>{
//       if(cluster.workers[wid]) {
//         cluster.workers[wid].process.kill('SIGKILL');
//       }
//     }, 20*1000);
//   }
//   setTimeout(stopWorker, 5*1000);
// }
