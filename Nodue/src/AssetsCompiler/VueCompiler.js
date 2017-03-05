module.exports = class VueCompiler
{
	constructor(options)
	{
		this.options = options;
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

		let pathInfo = fs.lstatSync(this.options.input);

		if (pathInfo.isFile()) {
			files[0] = this.options.input;
		} else if (pathInfo.isDirectory()) {
			files = fs.readdirSync(this.options.input);
			basePath = this.options.input + '/';
		}

		files.forEach(file => {
			this.transformation += VueComponentCompiler.compile(path.normalize(basePath + file), this.options);
		});
		
		if (this.options.output) {
			this.storeTransformation();
		} else {
			return this.transformation;
		}
	}

	storeTransformation()
	{
		fs.writeFileSync(this.options.output, `module.exports = {${this.transformation}};`);
	}
}