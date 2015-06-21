var utils = {

	// Common.js extend method: https://github.com/commons/common.js
	extend: function(){
		var objects = Array.prototype.slice.call( arguments ); // to array?
		var destination = {};
		for( var obj in objects ){
			var source = objects[obj];
			for (var property in source){
				if (source[property] && source[property].constructor && source[property].constructor === Object) {
					destination[property] = destination[property] || {};
					destination[property] = arguments.callee(destination[property], source[property]);
				} else {
					destination[property] = source[property];
				}
			}
		}
		return destination;
	}

};