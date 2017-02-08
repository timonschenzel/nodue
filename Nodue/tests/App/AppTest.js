module.exports = class AppTest extends TestCase
{
	test_it_is_able_to_fetch_a_config_file()
	{
		// Create dummy config file
		fs.writeFileSync('./config/dummy.js', 'module.exports = { foo: "bar" }');

		let foo = app.config('dummy.foo');

		this.assertEquals('bar', foo);

		fs.unlinkSync('./config/dummy.js');
	}

	test_is_is_able_to_return_data_from_config_files()
	{
		app.resetConfig();

		console.log(app.config());

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
	}
}