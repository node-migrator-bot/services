"use strict"; 
// External
var _ = require("underscore");
	
var check = new require("./exceptions").create("serviceRef");

module.exports.SimpleServiceRef = function(service, context) {

	var list = [];
	var instance;

	this.toString = function() {
		return list.join(",");	
	};

	// Get the actual service instance. 
	// A caller must handover the other service uses the instance.
	// This will help to count the references.
	this.get = function(otherService) {
		check.notNull(otherService, "otherService");
		
		if(!instance) {
			var module = service.getModule();
			
			instance = context.require(module);

			if(instance.activate) {
				instance.activate(context);
			}
		}
		
		list.push(otherService.getServiceId());
		
		return instance;
	};
	
	// Unget the service instance. 
	// A caller must handover the service which releases the instance.
	// The caller is not allowd to use the instance afterwards.
	// The ref count will be decreased.
	this.unget = function(otherService) {
		check.notNull(otherService, "otherService");

		var i = _.indexOf(list, otherService.getServiceId());
		list.splice(i, 1);

	
		/*
		if(list.length === 0) {
			
			if(instance.deactivate) {
				instance.deactivate(context);
			}
		}
			*/

	};
};