module.exports = {
	to_hyphen(string)
	{
	    return string.replace( /([a-z])([A-Z])/g, '$1-$2' ).toLowerCase();
	},

	to_camel_case(string)
	{ 
	    return string.toLowerCase().replace(/-(.)/g, (match, group1) => {
	        return group1.toUpperCase();
	    });
	}
}