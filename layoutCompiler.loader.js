let path = require('path');

module.exports = function(source) {
	let name = path.basename(this.resourcePath);
	name = name.replace('.vue.layout', '') + '-layout';
	return `{
		"${name}": \`${source}\`
	}`
	// name++;
	// if (layoutData == false) {
	// 	let layoutData = '{';
	// }

	// layoutData += "'" + name + "': `" + source + "`,";

	// return layoutData + '}';
}
