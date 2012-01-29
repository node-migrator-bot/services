"use strict"; 

var _ = require("underscore");
var check = new require("./exceptions").create("binder");

// A Binder constructor. 
// @param service The managed service,
// @param consumes A array of consume objects (as specifed in packages.json/services). 
module.exports = function(service, consumes) {
	check.notNull(service, "service");
	check.isArray(consumes, "consumes")
	
	// A lookup map to the consuer rules for a serviceClass.	
	// Map Key: serviceClass Value: consueRules.
	var consumesMap = {};

	// Contains for each consumed service a object which provides 
	// the service and and a dispose method.
	var consumedServices = {};

	_.each(consumes, function(e) {
		consumesMap[e.serviceClass] = e
	});

	// Get all binded services. 
	this.getBindServices = function() {
		var services = [];
		_.each(consumedServices, function(e) {
			services.push(e.service);	
		});
		return services;
	};

	// Bind the given service to the associated service in case associated service has a consumer rule, 
	this.bind = function(otherService) {
		check.notNull(otherService, "otherService");

		// Iterate over provided services and bind it if this service is a consumer.
		_.each(otherService.provides(), function(e) {
		
			// Does this service consumes a provided services?
			var consumeRules = consumesMap[e];

			if(consumeRules) {
				
				try {
					// Get this service instance. 
					var instance = service.instance().get(service);
					
					// Check if instance support needed un/setter. 
					if(!_.isFunction(instance[consumeRules.set]) || !_.isFunction(instance[consumeRules.unset]))	{
						otherService.instance().unget(service);
						console.error("Cannot bind service because setter or getter method is incorrect. Expected setter: " + consumeRules.set + " Expected unsetter: " + consumeRules.unset);	
						return;
					}
					
					try {
						// Get other service instance - use this service as user.
						var otherInstance = otherService.instance().get(service);
			
						instance[consumeRules.set].call(instance, otherInstance);

					} catch(err) {
						// It is not possible top bind the service. unget instance.
						otherService.instance().unget(service);
						console.error("Cannot bind service.", err);
					}

					consumedServices[otherService.getServiceId()] = {
						service: otherService,

						dispose: function() {
								
							// Get this service instance. 
							var instance = service.instance().get(service);
							
							try {
								// Remove injected service from other service.
								instance[consumeRules.unset].call(instance, otherInstance);

								// Tell other service that reference is not longer needed.
								// That will give the other service the chance to clenaup 
								// if needed.
								otherService.instance().unget(service);

								// The service is not longer used by this service - remove it from the list.
								delete consumedServices[otherService.getServiceId()];

							} finally {
								service.instance().unget(service);
							}
						}
					};

				} finally {
					service.instance().unget(service);
				} 
			}
		});
	};

	// Unbind all consumer services.
	this.unbindAll = function() {
		for(var i in consumedServices) {
			consumedServices[i].dispose();
		}
	};

	// Unbind a specific service.	
	this.unbind = function(otherService) {
		check.notNull(otherService, "otherService");
		
		var ref = consumedServices[otherService.getServiceId()];
		if(ref) {
			ref.dispose();
		}
	};
};
