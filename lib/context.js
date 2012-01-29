"use strict"; 

;(function() {
	
	// External
	var path = require("path");
	var EventEmitter = require('events').EventEmitter
	
	// Intenal 
	var check = new require("./exceptions").create(module.id);

	var Context = function(serviceMgr, pkg) {
		var self = this;
		
		// Event delgates.
		 
		var startedHandler = function(service) {
			self.emit("serviceStarted", service);
		};

		var stoppedHandler = function(service) {
			self.emit("serviceStopped", service);
		};
		
		// Methods 

		this.findServices = function(serviceClass, fn) {
			check.notNull(serviceClass, "serviceClass");
			return serviceMgr.findServices(serviceClass, fn);	
		};

		this.require = function(moduleName) {
			//check.notNull(moduleName, "moduleName");
			var module = path.join(pkg.getLibDirectory(), moduleName);
			return require(module);	
		};

		this.start = function(service) {
			serviceMgr.emit("serviceStarted", service);

			serviceMgr.on("serviceStarted", startedHandler);
			serviceMgr.on("serviceStopped", stoppedHandler);
		};

		this.stop = function(service) {
			serviceMgr.removeListener("serviceStarted", startedHandler);
			serviceMgr.removeListener("serviceStopped", stoppedHandler);

			serviceMgr.emit("serviceStopped", service);
		};

	};

	// Add event emitter functionality.
	Context.prototype = new EventEmitter();

	module.exports = Context;

})();