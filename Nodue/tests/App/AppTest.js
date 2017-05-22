module.exports = class AppTest extends TestCase
{
	/** @test */
	it_is_able_to_generate_a_proper_path_with_a_base_url_and_addon()
	{
		let realPath = app.basePath;

		app.basePath = '/Projects/nodue/bootstrap/../';

		this.assertEquals(path.normalize('/Projects/nodue/test_folder'), app.path('test_folder'));

		app.basePath = realPath;
	}

	/** @test */
	it_is_able_to_load_a_specific_file()
	{
		fs.writeFileSync('./tests/dummy.js', 'module.exports = { foo: "bar" }');

		let file = app.fileLoader.load('tests/dummy.js');

		this.assertEquals({
			foo: 'bar'
		}, file);

		fs.unlinkSync('./tests/dummy.js');
	}

	/** @test */
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

	/** @test */
	it_is_able_to_fetch_a_config_file()
	{
		// Create dummy config file
		fs.writeFileSync('./config/dummy.js', 'module.exports = { foo: "bar" }');
		app.bootstrapper.loadConfigFiles();

		let foo = app.config('dummy.foo');
		this.assertEquals('bar', foo);

		fs.unlinkSync('./config/dummy.js');
	}

	/** @test */
	it_is_able_to_return_data_from_config_files()
	{
		app.resetConfig();

		app.registerConfig('app', {
			foo: 'bar',
			bar: 'baz',
			sub: {
				name: 'nodue',
			}
		});

		app.registerConfig('database', {
			user: 'bar',
		 	password: 'baz',
		 	database: 'nodue',
		 	table: {
		 		name: 'nodue',
		 	}
		});

		this.assertEquals({
			foo: 'bar',
			bar: 'baz',
			sub: {
				name: 'nodue',
			}
		}, app.config());

		this.assertEquals('nodue', app.config('sub.name'));
		this.assertEquals('nodue', app.config('app.sub.name'));

		this.assertEquals({
			user: 'bar',
		 	password: 'baz',
		 	database: 'nodue',
		 	table: {
		 		name: 'nodue',
		 	}
		}, app.config('database'));

		this.assertEquals('nodue', app.config('database.table.name'));

		app.bootstrapper.loadConfigFiles();
	}
}