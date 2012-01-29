"use strict"; 

var ServiceManager = require("./servicemanager");

module.exports = {
	lookup:  		require("./lookup"),
	serviceManager: new ServiceManager(),

	activate: function() {
	},

	deactivate: function() {

	}
}
