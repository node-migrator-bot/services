"use strict"; 

;(function() {
	// Internal 
	var utils = require("./fileutils");
	var Package = require("./package");
	var check = require("./exceptions").create("serviceManager");

	// External
	var _ = require("underscore");
	var EventEmitter = require("events").EventEmitter;

	module.exports = function() {
		var self = this;		
		var packages = [];

		this.init = function(packageScanner) {
			check.notNull(packageScanner, "packageScanner");

			var list = packageScanner.scan();	
			
			list = _.sortBy(list, function(e) {
				if(e.packageName === "services") return -1
				return 1;
	
			});

			_.each(list, function(e) {
				try {
					var data = utils.loadJson(e.file);
					packages.push(new Package(self, e, data));
				} catch(err) {
					console.error("Cannot load package information: ", e);
					throw err;		
				}
			});
		};

		this.findServices = function(serviceClass, fn) {
			check.notNull(serviceClass, "serviceClass");
			check.notNull(fn, "fn");

			_.each(packages, function(p) {
				_.each(p.getServices(), function(s) {
					if(s.isStarted()) {
						_.each(s.provides(), function(cls) {
							if(cls === serviceClass) {
								fn(s);
							}	
						});
					}	
				});
			});	
		};

		this.getServices = function() {
			
			var serviceList = [];

			_.each(this.getPackages(), function(p) {
				_.each(p.getServices(), function(e) {
					serviceList.push(e);
				});
					
			});

			return serviceList;
		};

		this.getPackages = function() {
			return packages;
		};
		
		this.getPackage = function(name) {
			check.notNull(name, "name");
			
			for(var i in packages) {
				if(packages[i].getPackageName() == name) {
					return packages[i];
				}
			}
		}
	}

	module.exports.prototype = new EventEmitter();

})();