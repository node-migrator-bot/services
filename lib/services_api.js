"use strict"; 

var ServiceManager = require("./servicemanager");

module.exports = {
	lookup:  		require("./lookup"),
	serviceManager: new ServiceManager(),

	activate: function() {
		console.log("services has been started");
	},

	deactivate: function() {
		console.log("services has been stopped");
	}
}
