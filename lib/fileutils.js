"use strict"; 
(function() {
	
	var fs = require('fs');
	var path =  require('path')
	var string = require('underscore.string');
		
	/**
	 * Returns true in case given file path 'p' is browsable.
	 */
	function isBrowseable(p) {
		if(string.startsWith(path.basename(path), '.')) {
			return false;
		}

		var stat = fs.lstatSync(path.resolve(p));
		return !stat.isSymbolicLink() && stat.isDirectory()
	};

	/**
	 * Walk recursive down the given file path 'curPath'.
	 * The 'command' function will be executed foe each vist file/folder. 
	 * The 'command' function should return false to stop recursition.
	 * The level can be used to stop isBrowseable.
	 */
	function walkDown(curPath, command, level) {
		if(!path.existsSync(curPath) || !isBrowseable(curPath)) {
			return;
		}
		
		var files = fs.readdirSync(curPath);

		for(var f in files) {
			var filePath = path.join(curPath, files[f]);
			
			if(command(curPath, filePath, level) && isBrowseable(filePath)) {
				walkDown(filePath, command, level+1);
			}
		}
	};
	
	module.exports = { 
		walkDown: function(path, command) {
			return walkDown(path, command, 0);
		},

		loadJson: function(file) {
			var data = fs.readFileSync(file);
			return JSON.parse(data);
		},

		loadConfig: function(file) {
			if(!file) {
				var workingDir = fs.realpathSync(".");
				var fileName = "config.json";
				file = path.join(workingDir, fileName);

				console.log("No configuration file specified. Use: " + file);
			}

			try {
				if(path.existsSync(file)) {
					return this.loadJson(file);
				}
			} catch(e) {
				console.error("Cannot load or parse" + file, e);
			}

			return undefined;
		},

		enumFilesWithExtension: function(path, ext, fn) {
			// return in anycase an array. 
			var result = [];

			if(path.existsSync(path)) {
				var files = fs.readdirSync(path);
				for(var f in files) {
					if(string.endsWith(files[f], ext)) {
						var result = fn(path.join(curPath, files[f]));
						if(result !== undefined && result !== null) {
							result.push(result);
						}
					}
				}
			}	
			return result;
		},

		getFileIfExists: function(path, name) {
			var f = path.join(path, name)
			if(path.existsSync(f)) {
				return f;
			}
		}
	};

// Module End	
})();


