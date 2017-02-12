module.exports = class AppTest extends TestCase
{
	/** test */
	it_is_able_to_load_a_specific_file()
	{
		fs.writeFileSync('./tests/dummy.js', 'module.exports = { foo: "bar" }');

		let file = app.fileLoader.load('tests/dummy.js');

		this.assertEquals({
			foo: 'bar'
		}, file);

		fs.unlinkSync('./tests/dummy.js');
	}

	/** test */
	it_is_able_to_load_multiple_files_inside_a_directory()
	{
		fs.mkdirSync('./tests/dummy');
		fs.writeFileSync('./tests/dummy/foo.js', 'module.exports = { foo: "bar" }');
		fs.writeFileSync('./tests/dummy/bar.js', 'module.exports = { bar: "baz" }');

		let files = app.fileLoader.loadFrom('tests/dummy');

		this.assertEquals({
			foo: 'bar'
		}, files.foo);

		this.assertEquals({
			bar: 'baz'
		}, files.bar);

		fs.unlinkSync('./tests/dummy/foo.js');
		fs.unlinkSync('./tests/dummy/bar.js');
		fs.rmdirSync('./tests/dummy');
	}

	/** test */
	it_is_able_to_fetch_a_config_file()
	{
		// Create dummy config file
		fs.writeFileSync('./config/dummy.js', 'module.exports = { foo: "bar" }');
		app.bootstrapper.loadConfigFiles();

		let foo = app.config('dummy.foo');
		this.assertEquals('bar', foo);

		fs.unlinkSync('./config/dummy.js');
	}

	/** test */
	it_is_able_to_return_data_from_config_files()
	{
		app.resetConfig();

		app.registerConfig('app', {
			foo: 'bar',
			bar: 'baz',
		});

		app.registerConfig('database', {
			user: 'bar',
		 	password: 'baz',
		 	database: 'nodue',
		});

		this.assertEquals({
			foo: 'bar',
			bar: 'baz',
		}, app.config());

		this.assertEquals({
			user: 'bar',
		 	password: 'baz',
		 	database: 'nodue',
		}, app.config('database'));
	}
}