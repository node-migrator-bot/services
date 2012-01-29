"use strict"; 
;(function() {

var _ = require("underscore");
var EventEmitter = require('events').EventEmitter

var check = require("./exceptions").create("registry");

// A service registry.
var ServiceRegistry = function() {
	
	var self = this;

	// Event emitter.
	this.setMaxListeners(0);
	
	// counter for IDs
	var id = 0;
	
	// Holds all registered service instances.
	var services = {}
	
	// Provide a new service with given properties.
	// The properties is a simple map which can be used to look up services.
	// The service itself should be an object.
	this.provide = function(properties, service) {
		check.notNull(properties, "properties");
		check.notNull(service, "service");

		// A unique string id would be better.
		var serviceId = id++; 
		
		// create a service holder.
		services[serviceId] = {
			id: serviceId,
			properties: properties,
			service: service
		};
		
		// Notify world that a new service is availbale.
		this.emit("serviceProvided", serviceId, properties);
		
		// returns a handle for the registered service. 
		// This handle allows to get the service id and to remove the service from the 
		// registry without holding a instance of the servervice registry.
		return {
			remove: function() {
				self.removeService(serviceId);
			},
			
			id: function() {
				return serviceId;
			}
		};
	};
	
	// Get service by id.
	this.getService = function(serviceId) {
		return services[serviceId];
	}
	
	// Removes associated service by service id.
	this.removeService = function(serviceId) {
		var ref = services[serviceId];
		if(ref) {
			delete services[serviceId];
			
			// Nofity world that a service has been removed.
			this.emit("serviceStopped", serviceId, ref.properties);
		}
	}
	
	// Find services via matcher function. The matcher function will receive the properties for each 
	// registered service. The matcher function should return true in case the service should be 
	// added to the result list. 
	// This method returns an array with service declarations. 
	this.findServices = function(matcherFunction) {
		var res = [];
		_.each(services, function(e) {
			if(matcherFunction(e.properties)) {
				res.push(e);
			}
		});
		return res;
	};
}

// Add event emitter functionality.
ServiceRegistry.prototype = new EventEmitter();

// Singelton 
module.exports = new ServiceRegistry();

// Module end.
})();



