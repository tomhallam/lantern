var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.
var Bleacon = require('bleacon');

// Report crashes to our server.
require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;
var beacons = [];

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
  mainWindow.openDevTools();

  // Get a reference to the webContents API from the Window
  var webContents = mainWindow.webContents;

  // Beacon scan code
  Bleacon.on('discover', function(beacon) {

    var beaconExists = beacons.filter(function(existingBeacon) {
      return (
        beacon.uuid === existingBeacon.uuid
        && beacon.major === existingBeacon.major
        && beacon.minor === existingBeacon.minor
      );
    });

    if(!beaconExists.length) {
      beacons.push(beacon);
    }
    else {
      beacons = beacons.map(function(existingBeacon) {
        if(beacon.uuid === existingBeacon.uuid && beacon.major === existingBeacon.major && beacon.minor === existingBeacon.minor) {
          return beacon;
        }
      });
    }

    webContents.executeJavaScript('updateBeaconList(' + JSON.stringify(beacons) + ')')

  });

  Bleacon.startScanning();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
    Bleacon.stopScanning();
  });
});
