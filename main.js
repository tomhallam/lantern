var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.

var ipc = require('ipc');
var BeaconManager = require('./components/beaconManager');

var debug = require('debug')('lantern:main');

// Report crashes to our server.
require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;
var beacons = [];
var frontendReady = false;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {

  // Create a new BeaconManager instance
  var beaconManager = new BeaconManager();

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    'min-width': 500,
    'min-height': 200,
    'accept-first-mouse': true,
    'title-bar-style': 'hidden'
  });

  // and load the index.html of the app.
  mainWindow.loadUrl('file://' + __dirname + '/app/index.html');

  // Open the DevTools.
  //mainWindow.openDevTools();

  // Get a reference to the webContents API from the Window
  var webContents = mainWindow.webContents;

  // Respond to tree update events
  beaconManager.on('treeUpdate', function(tree) {
      webContents.send('main:beaconUpdate', tree);
  });

  // Event listener for when the frontend is ready
  ipc.on('frontend-ready', function(event) {
    if(!frontendReady) {
      debug('Frontend ready');
      frontendReady = true;
      beaconManager.init();
      event.sender.send('main:scanning', '');
    }
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {

    beaconManager.stop();
    mainWindow = null;

  });
});
