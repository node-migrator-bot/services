"use strict"; 
;(function() {
	
	// External 
	var _ = require("underscore");

	// Internal 
	var Binder = require("./binder");
	var ServiceTracker = require("./servicetracker");
	var Ref = require("./servicerefs").SimpleServiceRef;
	var check = new require("./exceptions").create("binder");
	
	var serviceIdCounter = 0;
	
	module.exports = function(pkg, servicedata, context) {
		check.notNull(pkg, "pkg");
		check.notNull(servicedata, "servicedata");
		
		// verify service data
		check.notNull(servicedata.module, "servicedata.module");

		var id = serviceIdCounter++;
		var started = false;
		var binder = new Binder(this, servicedata.consumes || []);
		var serviceTracker = new ServiceTracker(this, binder);
		var ref = new Ref(this, context);
		
		this.getBindServices = function() {
			return binder.getBindServices();
		}	
		this.getServiceName = function() {
			return servicedata.name ? servicedata.name : this.getModule();
		};

		this.toString = function() {
			return this.getServiceName() + " (" + pkg.getPackageName()  + ")";	
		};
		this.getPackage = function() {
			return pkg;	
		};

		this.instance = function() {
			return ref;	
		};

		this.getServiceId = function() {
			return id;
		};

		this.getModule = function() {
			return servicedata.module;			
		};

		/**
		 * String array of provided service classes.
		 */
		this.provides = function() {
			return servicedata.provides || [];
		};

		/**
		 * Consumers rules.
		 */
		this.consumes = function() {			
			return servicedata.consumes || [];
		};

		this.isStarted = function() {
			return started;
		};

		this.start = function() {
			if(!started) {
				started = true;
				context.start(this);
				serviceTracker.start(context);	
				
			}
		};

		this.stop = function() {
			if(started) {
				started = false
				
				binder.unbindAll();
				
				serviceTracker.stop(context);
				context.stop(this);
			}
		}
	};



})();