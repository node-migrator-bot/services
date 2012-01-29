"use strict"; 
;(function() {

// External
var fs = require("fs");
var path = require("path");
var _ = require("underscore");

// Internal
var fsUtils = require("./fileutils");

function findPackagesImpl(directoryPath, packageList) {
	if(!_.isString(directoryPath)) {
		throw new Error("Illegal argument. 'directoryPath' Must be a string"); 
	}

	var packageList = packageList || {};
	
	fsUtils.walkDown(directoryPath, function(cur, file, level) {
		if(path.basename(file, ".json") === "package") {
			var packageName = path.basename(cur);
			if(!packageList[packageName]) {
				packageList[packageName] = {
					packageName: packageName,
					file: file 
				}
			}
		}

		return level < 2;
	});

	return packageList;
}

module.exports =  {
	/**
	 * Finds packages for the given filepath or array of file path.
	 * Returns an array a object which provides the packageName 
	 * and file location to the package.json
	 */
	findPackages: function(pathOrArray) {
		if(_.isString(pathOrArray)) {
			return findPackagesImpl(pathOrArray);
		} else if(_.isArray(pathOrArray)) {
			var packages = {};
			_.each(pathOrArray, function(e) {
				findPackagesImpl(e, packages);
			});
			return packages;	
		}

		throw new Error("Illegal argument. Must be a string or array");
	}
};



// Module End
})();