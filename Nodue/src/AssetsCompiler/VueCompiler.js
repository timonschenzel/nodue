module.exports = class VueCompiler
{
	constructor(options)
	{
		this.cacheFolder = app.path(app.config('app.cacheFolder'));
		this.options = options;
		this.inputInfo = fs.lstatSync(this.options.input);
		this.transformation = '';
	}

	static compile(options)
	{
		let compiler = new this(options);

		return compiler.compileComponents();
	}

	compileComponents()
	{
		let files = [];
		let basePath = '';

		if (this.inputInfo.isFile()) {
			files[0] = this.options.input;
			this.options.compileSingleFile = true;
		} else if (this.inputInfo.isDirectory()) {
			files = fs.readdirSync(this.options.input);
			basePath = this.options.input + '/';
			this.options.compileSingleFile = false;
		}

		files.forEach(file => {
			this.transformation += VueComponentCompiler.compile(path.normalize(basePath + file), this.options);
		});
		
		this.transformation = this.transformation.trim();

		if (this.transformation.endsWith(',')) {
			this.transformation = this.transformation.slice(0, -1);
		}

		if (this.options.output) {
			this.storeTransformation();
		} else {
			return this.transformation;
		}
	}

	storeTransformation()
	{
		this.ensureOutputLocationExists();

		if (! this.options.compileSingleFile) {
			this.transformation = `{${this.transformation}}`;
		}
		fs.writeFileSync(this.options.output, `module.exports = ${this.transformation};`);
	}

	ensureOutputLocationExists()
	{
		let outputFolder = null;
		let fileName = null;

		if (this.options.output.includes('/')) {
			outputFolder = this.options.output.split('/');
			fileName = outputFolder.pop();
			outputFolder = outputFolder.join('/');
		} else if (this.options.output.includes('\\')) {
			outputFolder = this.options.output.split('\\');
			fileName = outputFolder.pop();
			outputFolder = outputFolder.join('\\');
		}
		
		if (! fs.existsSync(outputFolder)) {
			fs.mkdirSync(outputFolder);
		}
	}
}
