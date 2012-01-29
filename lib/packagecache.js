"use strict"; 
;(function() {
	// Internal
	var utils = require("./fileutils");

	module.exports = function(packages) {
		var cache = {};
		var packageFactory;

		this.setPackageFactory = function(factory) {
			packageFactory = factory;
		};

		this.getPackageInfo = function(packageName) {
			var result = cache[packageName];

			if(!result) {
				var pkg = packages[packageName];
				var data = utils.loadJson(pkg.file);
				result = packageFactory.createPackage(pkg, data);
				cache[packageName] = result;
			}

			return result;
		};	
	};

})();