module.exports = class VueComponentCompiler
{
	constructor(options)
	{
		this.options = options;
		this.compileData = '';
	}

	static compile(options)
	{
		let compiler = new this(options);

		compiler.compileInternal();
	}

	compileInternal()
	{
		let files = fs.readdirSync(this.options.input);

		files.forEach(file => {
			let name = file.replace(path.extname(file), '');

			if (this.options.suffix) {
				name += this.options.suffix;
			}

			if (this.options.prefix) {
				name = this.options.prefix + name;
			}

			this.compileComponent(`${this.options.input}/${file}`, this.camelCaseToDash(name));
		});
		
		this.storeCompilation();
	}

	compileComponent(filePath, name)
	{
		let content = fs.readFileSync(filePath, 'utf8');

		content = content.replace('`', '\\`');
		content = content.replace('`,', '\\`,');
		content = content.replace('module.exports = ', '');

		this.compileData += "'" + name + "': `" + content + "`,"
	}

	storeCompilation()
	{
		fs.writeFileSync(this.options.output, `module.exports = {${this.compileData}};`);
	}

	camelCaseToDash(string)
	{
	    return string.replace( /([a-z])([A-Z])/g, '$1-$2' ).toLowerCase();
	}
}