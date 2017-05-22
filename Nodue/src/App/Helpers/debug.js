module.exports = {
	dump(value)
	{
		console.log(value);
	},

	dd(value)
	{
		dump(value);
		process.exit(1);
	}
}
