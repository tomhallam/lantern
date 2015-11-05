var Bleacon = require('bleacon');
var EventEmitter = require('events');
var util = require('util');
var debug = require('debug')('lantern:beaconManager');

util.inherits(BeaconManager, EventEmitter);
function BeaconManager() {

  this.tree = {};
  EventEmitter.call(this);

}

BeaconManager.prototype.init = function() {

  var self = this;

  debug('BeaconManager initialised');
  Bleacon.on('discover', function(beacon) {
    self.updateTree(beacon);
  });

  debug('BeaconManager scanning...');
  Bleacon.startScanning();

  return this;

}

BeaconManager.prototype.updateTree = function(updatedBeacon) {

  var self = this;

  if(!this.tree[updatedBeacon.uuid]) {
    this.tree[updatedBeacon.uuid] = [];
  }
  var uuidFamilyTree = this.tree[updatedBeacon.uuid];

  var beaconExists = uuidFamilyTree.filter(function(childBeacon) {
    return updatedBeacon.major === childBeacon.major && updatedBeacon.minor === childBeacon.minor;
  }).length;

  debug(beaconExists);
  if(beaconExists) {
    debug('Updating beacon %s (ma %d, mi %d)', updatedBeacon.uuid, updatedBeacon.major, updatedBeacon.minor);
    this.updateBeaconInTree(updatedBeacon);
  }
  else {
    debug('Creating beacon %s (ma %d, mi %d)', updatedBeacon.uuid, updatedBeacon.major, updatedBeacon.minor);
    uuidFamilyTree.push(updatedBeacon);
  }

  debug('BeaconManager.treeUpdate %o', this.tree);
  self.emit('treeUpdate', this.tree);

  return this;

}

BeaconManager.prototype.updateBeaconInTree = function(updatedBeacon) {

  var self = this;
  if(!this.tree[updatedBeacon.uuid]) {
    return false;
  }

  this.tree[updatedBeacon.uuid] && this.tree[updatedBeacon.uuid].forEach(function(beacon, beaconIndex) {
    if(beacon.major === updatedBeacon.major && beacon.minor === updatedBeacon.minor) {
      debug('Updated beacon in tree %s at index %d', updatedBeacon.uuid, beaconIndex);
      self.tree[updatedBeacon.uuid][beaconIndex] = updatedBeacon;
    }
  });

  return true;

}

BeaconManager.prototype.stop = function() {

  debug('BeaconManager stopping scan.');
  return Bleacon.stopScanning();

}

module.exports = BeaconManager;
