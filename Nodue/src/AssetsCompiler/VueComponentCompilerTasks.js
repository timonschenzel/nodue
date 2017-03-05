module.exports = class VueComponentCompilerTasks
{
	constructor(file, options)
	{
		this.file = file;
		this.fileExtension = path.extname(this.file);
		this.options = options;
		this.rawData = fs.readFileSync(this.file, 'utf8');
		this.transformation = '';
	}

	get tasks()
	{
		return [
			'findBaseFileName',
			'addSuffixToFileNameIfNeeded',
			'addPrefixToFileNameIfNeeded',
			'addGlobalPrefixToFileNameIfNeeded',
			'convertNameIntoHyphen',
			'trimRawData',
			'removeSemicolonAtTheEndOfTheRawDataIfNeeded',
			'removeModuleDotExportsAtTheBeginningOfRawDataIfNeeded',
			'backslashBackticksInRawDataIfNeeded',
			'prefixCustomComponentReferences',
			'compileComponent',
		];
	}

	findBaseFileName()
	{
		this.name = path.basename(this.file, this.fileExtension);
	}

	addSuffixToFileNameIfNeeded()
	{
		if (this.options.suffix) {
			this.name += this.options.suffix;
		}
	}

	addPrefixToFileNameIfNeeded()
	{
		if (this.options.prefix) {
			this.name = this.options.prefix + this.name;
		}
	}

	addGlobalPrefixToFileNameIfNeeded()
	{
		if (this.options.globalPrefix !== false) {
			this.name = app.config('components.prefix') + this.name;
		}
	}

	convertNameIntoHyphen()
	{
		this.name = to_hyphen(this.name);
	}

	trimRawData()
	{
		this.rawData = this.rawData.trim();
	}

	removeSemicolonAtTheEndOfTheRawDataIfNeeded()
	{
		if (this.rawData.charAt(this.rawData.length - 1) == ';') {
			this.rawData = this.rawData.slice(0, -1);
		}
	}

	removeModuleDotExportsAtTheBeginningOfRawDataIfNeeded()
	{
		this.rawData = this.rawData.replace('module.exports = ', '');
	}

	backslashBackticksInRawDataIfNeeded()
	{
		if (this.options.compileAsString) {
			this.rawData = this.rawData.replace('`', '\\`');
			this.rawData = this.rawData.replace('`,', '\\`,');
		}
	}

	prefixCustomComponentReferences()
	{
		let tagRegex = null;
		let regex = new RegExp(
		  /<(.*?)>/,
		  'gim');

		while (tagRegex = regex.exec(this.rawData)) {
			let fullTag = tagRegex[0];
			let tagName = null;

			if (! fullTag.includes(' ')) {
				if (fullTag.startsWith('</')  && fullTag.endsWith('>')) {
					tagName = fullTag.replace('</', '').replace('>', '');
				} else if (fullTag.startsWith('<') && fullTag.endsWith('>')) {
					tagName = fullTag.replace('<', '').replace('>', '');
				}
			} else {
				let parts = fullTag.split(' ');
				tagName = parts[0].replace('<', '');
			}

			let component = string(to_camel_case(tagName)).capitalize();

			if (app.globalComponentExists(component + this.fileExtension) || app.globalComponentExists(component + '.vue') || app.globalComponentExists(component + '.js')) {
				this.rawData = this.rawData.replace(fullTag,  fullTag.replace(tagName, `${app.config('components.prefix')}-${tagName}`));
			}
		}
	}

	compileComponent()
	{
		if (this.options.compileAsString) {
			this.transformation = "'" + this.name + "': `" + this.rawData + "`,";
		} else {
			this.transformation = "'" + this.name + "': " + this.rawData + ",";
		}
	}
}