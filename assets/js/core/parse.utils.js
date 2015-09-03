(function() {

	var utils = Parse.utils = Parse.utils || {};

	utils.isFunction = function (functionToCheck) {
		var getType = {};
		return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
	};
	
	utils.param = function(parameters){
		var uriParams = [];
		
		Object.keys(parameters).forEach(function(param){
			uriParams.push(encodeURIComponent(param) + '=' + encodeURIComponent(parameters[param]));
		});

		return uriParams.join('&');
	};

	utils.unparam = function (value) {
		//check value exits and first char is ?
		if (value.length) {
			if(value[0] == '?') {
				value = value.substring(1);
			}
		} else {
			return {};
		}

		var
		// Object that holds names => values.
		params = {},
		// Get query string pieces (separated by &)
		pieces = value.split('&'),
		// Temporary variables used in loop.
		pair, i, l;

		// Loop through query string pieces and assign params.
		for (i = 0, l = pieces.length; i < l; i++) {
			pair = pieces[i].split('=', 2);
			// Repeated parameters with the same name are overwritten. Parameters
			// with no value get set to boolean true.
			params[decodeURIComponent(pair[0])] = (pair.length == 2 ?
			decodeURIComponent(pair[1].replace(/\+/g, ' ')) : true);
		}

		return params;
	};

	var deferred = {
			promise: function (base) {
				function callbackHandler(){
					var handlers = [], apply = function(handler){
						handler.apply(applied.scope, applied.args);
					}

					this.add = function(handler){
						if(utils.isFunction(handler)){
							if(!applied)
								handlers.push(handler);
							else
								apply(handler);
						}
					}; 

					this.apply = function(scope, args){
						if(!applied){
							applied = { scope: scope, args: Array.prototype.slice.call(args).slice() };
							handlers.forEach(apply);
						}
					};
				}

				var 
				status = 'pending', 
				applied = null,
				phases = [
					['resolve', 'done', new callbackHandler(), 'resolved'],
					['reject', 'fail',  new callbackHandler(), 'rejected']
				],        
				promised = base || {};

				promised.state = function(){ return status; };
				promised.always = function(){
					this.done.apply(this, arguments).fail.apply(this, arguments);
					return this;
				};
				promised.then = function(done, fail){
					this.done(done);
					fail && this.fail(fail);
					return this;
				};


				// append phase functions to deferred
				phases.forEach(function(phase, p){
					var trap = phase[0], 
						trigger = phase[1], 
						callbacks = phase[2], 
						statusText = phase[3];

					// resolveWith, rejectWith
					promised[trap + "With"] = function(scope, argumentsToRedirect){
						if(status != 'pending')
							return this;

						status = statusText;
						callbacks.apply(scope || this, argumentsToRedirect);

						return this;
					};

					// resolve, reject
					promised[trap] = function(/* argumentsToRedirect */){
						promised[trap + "With"](this, arguments);
						return this;
					};

					// done, fail
					promised[trigger] = function(callback){
						if(!applied || status == statusText)
							callbacks.add(callback);
						
						return this;
					};
				});

				promised.error = promised.fail;
				promised.success = promised.done;

				return promised;
			}
	};

	utils.anyway = function(deferreds, any) {
		deferreds = (deferreds || []);
		var current = 0, limit = deferreds.length, args = [];

		function _cb() {
			args.push([Array.prototype.slice.call(arguments), this]);
			current++;
			if(current == limit)
				any && any.apply(null, args);
		}

		deferreds.forEach(function(d){
			d.done(_cb).fail(_cb);
		});
	};

	utils.when = function () {
		var args = Array.prototype.slice.call(arguments.length == 1 && arguments[0] instanceof Array ? arguments[0] : arguments).slice(),
			resolveArgs = [], failArgs = [];
		function chain(defers, defer) {
			var def = defers.shift();
			if(def == null || def.length == 0)
				return defer;
			
			def.done(function () {
				resolveArgs.push(Array.prototype.slice.call(arguments));

				if (defers.length)
					new chain(defers, defer);
				else
					defer.resolveWith(defer, resolveArgs);

			}).fail(function () {
				failArgs.push(Array.prototype.slice.call(arguments));

				defer.rejectWith(defer, failArgs);
			});

			return defer;
		}

		return new chain(args.slice(), deferred.promise());
	};
    
})();