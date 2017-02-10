module.exports = class TestRunner
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

		this.getTestLocations();
	}

	test()
	{
		this.locations.forEach(location => {
			this.runTestsInLocation(location);
		});
	}

	runTestsInClass(testClass, path)
	{
		for (let name of Object.getOwnPropertyNames(Object.getPrototypeOf(testClass))) {
		    let method = testClass[name];

		    // Default filters:
		    // 1. Skip constructor
		    // 2. Only call methods with a 'test' prefix
		    if ( ! method instanceof Function || method === testClass || name == 'constructor' || ! name.startsWith('test')) {
		    	continue;
		    }

		    // Apply cli filter
		    if (this.filter && name != this.filter && testClass.constructor.name != this.filter) {
		    	continue;
		    }

		    testClass.name = path + ' -> ' + name;
		    testClass[name]();
		}
	}

	runTestsInLocation(location)
	{
        let testFiles = this.getTestFilesInLocation(location);

        for (let filePath in testFiles) {
        	this.runTestsInClass(new testFiles[filePath](), filePath);
        }
    }

    getTestFilesInLocation(object)
    {
    	let toReturn = {};
    	
    	for (let i in object) {
    		if (!object.hasOwnProperty(i)) continue;
    		
    		if ((typeof object[i]) == 'object') {
    			let flatObject = this.getTestFilesInLocation(object[i]);
    			for (let x in flatObject) {
    				if (!flatObject.hasOwnProperty(x)) continue;
    				
    				if (x.toLowerCase().endsWith('test')) {
    					toReturn[i + '/' + x] = flatObject[x];
    				}
    			}
    		} else {
    			if (i.toLowerCase().endsWith('test')) {
    				toReturn[i] = object[i];
    			}
    		}
    	}
    	return toReturn;
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