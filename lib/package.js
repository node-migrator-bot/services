"use strict"; 
;(function() {
	// External
	var path = require("path");
	var _ = require("underscore");
	
	// Internal 
	var Service = require("./service");
	var Context = require("./context");

	var packageIdCounter = 0;

	module.exports = function(serviceMgr, packageInfo, packageJson) {
		if(serviceMgr == null) {
			throw "service manager mut be set"
		}


		var packageId = packageIdCounter++;

		var services = processServices(packageJson, this, function(serviceData) {
			if(serviceValid(packageInfo.packageName, serviceData)) {
				// each service gets an own context instance.
				var context  = new Context(serviceMgr, this);
				return new Service(this, serviceData, context);
			}
		});

		this.getPackageName = function() {
			return packageInfo.packageName;	
		};

		// Ge package id.
		this.getPackageId = function() {
			return packageId;
		};

		// Get declared servers.
		this.getServices = function() {
			return services;
		};

		// Get lib directory
		this.getLibDirectory = function() {
			var moduleDir = path.dirname(packageInfo.file);		
			var libDir = "";

			// It seems not mandatory to speciy a lib dir.
			if(packageJson.directories) {
				libDir = packageJson.directories.lib || "";
			}
			
			return path.join(moduleDir, libDir);		
		};

		// Starts all services.
		this.start = function() {
			_.each(this.getServices(), function(service) {
				service.start();
			});			
		};

		// Stops all services.
		this.stop = function() {
			_.each(this.getServices(), function(service) {
				service.stop();
			});			
		};

		this.toString = function() {
			return this.getPackageName();
		}
	};


	function processServices(packageJson, scope, fn) {
		var result = [];
		if(packageJson.services) {			
			var services = packageJson.services;
			for(var idx in services) {
				var s = services[idx];

				var service = fn.call(scope, s);
				if(service) {
					result.push(service);
				}
				
			}
		}
		return result;
	};

	function serviceValid(pkgName, serviceData) {
		if(serviceData.module == null) {
			console.warn("Package: " + pkgName + ": service doesn't declare module name");
			return false;
		}
		return true;
	}

})();