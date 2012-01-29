### Services JS

Services will provide a servce layer for node js. It is inspired by the OSGi Declarative Services and allows modules/packages to publish services without a dependency on the Service JS layer itself. 

### How to install 

npm install services

To see a running exmaple is the best that you also install the commandline and services-commandline.

npm install commandline
npm install services-commandline


### How to configure and start services.

In order to configure the services you must create a json file. For example _config.json_
The configuration is a simple map. The key is the name of the package/module which should be started and the value is "true" or a map. 

Example:
	
	commandline: true,
	services-commandline: true,

The config.json will start two packages (commandline and service-commandline). The commandline start a simple commandline interface which can be extended via services. 
The services-commandline provides new commands for the commandline to control the service layer.

You can now write a little module which will simple start and configure the service layer.

	var services = require("services");
	services.configure("path/to/your/config.json");

The service layer up and running. The terminal should show you the commandline interface. Type help to get a overview of available commands. Type exit to go back to the node js repl.

### CommandlineService Example
The service layer extends the specification of the package.json

package.json:

	"services": [
		{ 
			"module": "./comandline-service",
			"consumes": [{
				"serviceClass": "commandline-cmd",
				"cardinality": "0..N",
				"set": "addCommand",
				"unset": "removeCommand"
			}],
			"provides": [ "otherServiceClass" ]	 
			"properties": {
				"customProperties": "value1", 
				"customProperties2": "value2"
			}
		}

		// multiple services possible.
	]


The package json has a new top level section called "services". It contains a list of service declarations. A service declaration must specify a module. The module must be available in the "lib" path. 

The service section can contain a "consumes" section. The "consumes" section must be a array list. Each list element must declare a "serviceClass". The "serviceClass" is a classification id which will be used to automatically bind services. The "servceClass" can be understood as a API contract like the module/package name in a require statement, all services of the same "serviceClass" must provide a compatible interface. See "provides"

A service might need another service to work correctly. A service needs the other service maybe only optional. Here comes the "cardinality" into the game. It allow to specify:

	0..n 	Zero to many.
	/* Currently not implemented
	0..1 	Zero to One.
	1..1	Mandatory.
	1..n 	Mandatory many.
	*/

To consume a service it must somehow be injected into the host service. The binder will call the method which is specified in the "set" section. It is also possible that consumed service will be stopped, in this case will method specified in "unset" be called. 

A service might also want to export some functionality to other services. A service can declare a list of "serviceClasses" to specify which functionality will be supported. The list of "serviceClasses" must be declared in the "provides" section. This section is optional.

The "properties" section is a simple map for custom meta meta. This meta data can for example be used to select a service. Properties with underscore "_" are reserved.

"consumes" and "provides" are optional but in a real world scenario it make no sense to declare none of it. 



### License

(The MIT License)

Copyright (c) 2009-2011 dkuffner <dkuffner@chilicat.net>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.