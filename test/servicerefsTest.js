var should = require("should");

var Ref = require("../lib/servicerefs").SimpleServiceRef;

describe('servicerefs', function(){

	describe('Object Service', function(){

		var ref = creteRef( {
			hello: "world"
		});
		
		var otherService = {
			getServiceId: function() {
				return 2;
			}
		};

		it('get service instance', function(){
			var r = ref.get(otherService);

			// Reference count for otherService must be set.
			ref.isRefBy(otherService).should.be.true;

			// Check the returned serivce instance.
			r.hello.should.equal("world");
			ref.count.should.equal(0);
		});
		
		it('get service instance a second time - same instance', function(){
			// Make sure that the second get returns the same instance.
			var r = ref.get(otherService);
			r.hello.should.equal("world");
			ref.count.should.equal(0);

			// Reference count for otherService must be set.
			ref.isRefBy(otherService).should.be.true;
		});

		it('unget service instance', function() {
			// Unget
			ref.unget(otherService);
			ref.isRefBy(otherService).should.be.false;
		});

		it('get service instance again - new instance', function() {
			// Get again - new instance should be returned
			var r = ref.get(otherService);
			r.hello.should.equal("world");
			ref.count.should.equal(1); // new instance 
		});

	});


	describe('Function Service', function(){
		var count = 0;
		var ref = creteRef(function() {
			return {
				hello: "instance-" + count++
			};
		});
		
		var otherService = {
			getServiceId: function() {
				return 2;
			}
		};

		var otherService2 = {
			getServiceId: function() {
				return 3;
			}
		};


		it("get service instance", function() {
			var r = ref.get(otherService);

			// Reference count for otherService must be set.
			ref.isRefBy(otherService).should.be.true;

			// Check the returned serivce instance.
			r.hello.should.equal("instance-" + 0);
			ref.count.should.equal(0);
		});

		it("get second service instance", function() {
			var r = ref.get(otherService2);

			// Reference count for otherService must be set.
			ref.isRefBy(otherService2).should.be.true;

			// Check the returned serivce instance.
			r.hello.should.equal("instance-" + 1);
			ref.count.should.equal(1);
		});

		it("unget service instance", function() {
			ref.unget(otherService);
			// Reference count for otherService must be set.
			ref.isRefBy(otherService).should.be.false;
		});

		it("unget second service instance", function() {
			ref.unget(otherService2);
			// Reference count for otherService must be set.
			ref.isRefBy(otherService2).should.be.false;
		});
	});

});


function creteRef(result) {
	var count = 0;
	var ref = new Ref(
		{
			getServiceId: function() {
				return 1;
			}, 

			getModule: function() {
				return "testModule";
			}
		},
		{
			require: function(module) {
				should.strictEqual("testModule", module);
				ref.count = count++;
				return result;
			}
		}
	);

	return ref;
};