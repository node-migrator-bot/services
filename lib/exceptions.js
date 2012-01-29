"use strict"; 
;(function()  {
	
	var _ = require("underscore");

	
	module.exports = {
		create: function(module) {
			return {
				
				notNull: function(v, msg) {
					if(v == null) {
						throw new Error(module + "- Undefined: " + msg);
					}
				},

				isArray: function(v, msg) {
					if(!_.isArray(v)) {
						throw Error(module + "- Arra expected: " + msg);
					}
				}

			}
		}
	};

	})();