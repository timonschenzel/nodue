module.exports = class Tester
{
	constructor(processData)
	{
		this.configFile = 'jsunit.json';
		this.fs = require('fs');
		this.fileLoader = require('auto-loader');
		this.process = processData;
		this.pwd = processData.env.PWD + '/';

		this.config = {};
		this.locations = [];
		this.rawFilter = processData.env.npm_lifecycle_script;
		this.filter = this.parseFilter(this.rawFilter);
		this.loadConfig();
	}

	loadConfig()
	{
		if (this.fs.existsSync(this.configFile)) {
			this.config = JSON.parse(this.fs.readFileSync(this.configFile, 'utf8'));
		}
	}

	parseFilter(rawFilter)
	{
		let searchFilter = rawFilter.match(/"((?:\\.|[^"\\])*)"/);

		if (typeof searchFilter === 'object' && searchFilter !== null) {
			return searchFilter[1];
		}

		return null;
	}

	boot()
	{
		if (this.config.bootstrap) {
			require(this.path(this.config.bootstrap));
		}
	}

	test()
	{
		let locations = this.getTestLocations();

		locations.forEach(location => {
			let TestClass = new location.App.AppTest;

			for (let name of Object.getOwnPropertyNames(Object.getPrototypeOf(TestClass))) {
			    let method = TestClass[name];

			    // Default filters:
			    // 1. Skip constructor
			    // 2. Only call methods with a 'test' prefix
			    if ( ! method instanceof Function || method === TestClass || name == 'constructor' || ! name.startsWith('test')) {
			    	continue;
			    }

			    // Apply cli filter
			    if (this.filter && name != this.filter && TestClass.constructor.name != this.filter) {
			    	continue;
			    }

			    TestClass.name = TestClass.constructor.name + ' -> ' + name;
			    TestClass[name]();
			}
		});
	}

	getTestLocations()
	{
		// Load test files
		let fileLocations = this.config.files;

		fileLocations.forEach(location => {
			this.locations.push(this.loadFilesFrom(location));
		});

		return this.locations;
	}

	path(additionalPath)
	{
		return this.pwd + additionalPath;
	}

	loadFilesFrom(path)
	{
		if(this.fs.lstatSync(path).isDirectory() == false) {
			return require(this.path(path));
		}

		return this.fileLoader.load(this.path(path));
	}
}