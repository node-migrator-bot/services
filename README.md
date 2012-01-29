
A service is able to consume other services by observing the metadata of all installed packages/services. The service has also a specifed lifecircle. E.g. it is possible to stop a service. Other services can react on this event and can update the inner configurtion has needed.

CommandlineService Example
The service layer extends the specification of the package.json

package.json:


	// ...

	"services": [
		{ 
			"module": "comandline-service",
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


The package json has a new top level section called "services". It wil contain a list of service declarations. A service declartion must specify a module. The module must be available in the "lib" path. 

The service section can contain a "consumes" section. The "consumes" seconts must be a list. Each list element must declare a "serviceClass". The "serviceClass" is a classification id which will be used to automatically bind services. The "servceClass" can be understood as a API contract like the module in a require statement, all service of the same "serviceClass" must provide a comapatible interface. 

A service might need another service to work correctly. A service needs the other service maybe only optional. Here comes the "cardinality" into the game. It allow to specify:

	0..1 	Zero to One.
	0..n 	Zero to many.
	1..1	Mandatory.
	1..n 	Mandatory many.

 A service which should be consumer must somehow be injected. The binder will call the method which is specified in the "set" section. It is also possible that consumed service will be stopped, in this case will method specified in "unset" be called. This section is optional 

A service might also want to export some functionality to other services. A service can declare a list of "serivceClasses" to specify which functionality will be supported. The list of "serviceClasse" nust be declared in the "provides" section. This section is optional.

The "properties" section is a simple map for custom meta meta. This meta data can for example be used to select a service. Properties with underscore "_" are reserved.

"consumes" and "provides" are optional but in a real world scenario it make no sense to declare none of it. 