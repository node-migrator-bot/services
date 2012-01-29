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
		
		configure: function(configOrPath) {
			
			// Maybe is just a object.
			var config = configOrPath;

			if(configOrPath === undefined || _.isString(configOrPath)) {
				config = fileUtils.loadConfig(configOrPath);	
				if(!config) {
					throw new Error("Cannot configure services. Check either that config.json is in the working directory or given path " + configOrPath + " exists.");
				}
			}

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

})();
	
// Module End
