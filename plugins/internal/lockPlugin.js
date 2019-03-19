var CorePlugin = require('./../corePlugin').CorePlugin,
  util = require('util'),
  utils = require('./../../utils/utils.js');

var sensor, model;

var LockPlugin = exports.LockPlugin = function (params) {
  CorePlugin.call(this, params, 'lock', stop, simulate);
  model = this.model;
  this.addValue(true);
};
util.inherits(LockPlugin, CorePlugin);

function stop() {
  sensor.unexport();
};

function simulate() {
	var random_boolean = Math.random() >= 0.5;
	this.addValue(random_boolean);
};

LockPlugin.prototype.createValue = function (data){
  return {"lock": data, "timestamp": utils.isoTimestamp()};
};

LockPlugin.prototype.connectHardware = function () {
  var Gpio = require('onoff').Gpio;
  var self = this;
  sensor = new Gpio(self.model.values.lock.customFields.gpio, 'in', 'both');
  sensor.watch(function (err, value) {
    if (err) exit(err);
    self.addValue(!!value);
    self.showValue();
  });
  console.info('Hardware %s sensor started!', self.model.name);
};