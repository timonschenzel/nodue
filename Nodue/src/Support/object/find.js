object.prototype.find = function(expression) {
	expression = expression.replace('/', '.');
	let parts = expression.split('.');
	let object = this.raw;

	for(var part of parts) {
		if(object != undefined && object.hasOwnProperty(part)) {
			object = object[part];
		} else {
			object = undefined;
		}
	}

	return object;
}