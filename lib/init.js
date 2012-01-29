"use strict"; 

;(function() {

	// Internal
	var api = require("./services_api");

	var lookup = api.lookup;
	var serviceManager = api.serviceManager;
	
	var fileUtils = require("./fileutils");
	
	// External 
	var _ = require("underscore");

	module.exports = {
		
		lookup: lookup,
		serviceManager: serviceManager,
		
		configure: function(config) {
			
			serviceManager.init({
				scan: function() {
					return lookup.findPackages(module.paths);
				}
			});
			
			serviceManager.getPackage("services").start()

			for(var packageName in config) {
				var packageConfig = config[packageName];
				if(packageConfig) {
					var pkg = serviceManager.getPackage(packageName);
					if(pkg) {
						pkg.start();
					}
				}
			}
		}	
	};

	var config = fileUtils.loadConfig();
	if(config) {
		module.exports.configure(config);
	}

})();
	
// Module End
