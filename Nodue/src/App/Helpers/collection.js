module.exports = {

	// Six data types that are primitives:
	// Boolean
	// Null
	// Undefined
	// Number
	// String
	// Symbol (new in ECMAScript 6)
	// and Object
	
	collect(data)
	{
		if (typeof data == 'undefined') {
			return Sugar.Object;
		}

		if (typeof data == 'null') { // is object
			return Sugar.Object;
		}

		if (typeof data == 'boolean') {
			return data;
		}

		if (typeof data == 'symbol') {
			return data;
		}

		if (typeof data == 'number') {
			return Sugar.Number(data);
		}

		if (typeof data == 'string') {
			return Sugar.String(data);
		}

		if (typeof data == 'object') {
			return Sugar.Object(data);
		}

		if (typeof data == 'array') { // is object
			return Sugar.Array(data);
		}

		return data;
	}
}