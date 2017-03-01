let layoutData;
let name = 0;

module.exports = function(source) {
	console.log('file --- ' + __filename);
	return `{
		layout: \`${source}\`
	}`
	// name++;
	// if (layoutData == false) {
	// 	let layoutData = '{';
	// }

	// layoutData += "'" + name + "': `" + source + "`,";

	// return layoutData + '}';
}
