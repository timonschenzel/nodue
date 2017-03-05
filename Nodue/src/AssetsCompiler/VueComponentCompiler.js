module.exports = class VueComponentCompiler
{
	constructor(file, options)
	{
		this.file = file;
		this.options = options;
		this.compiler = new VueComponentCompilerTasks(this.file, this.options);
	}

	static compile(file, options)
	{
		let compiler = new this(file, options);

		return compiler.compileComponent();
	}

	compileComponent()
	{
		this.compiler.tasks.forEach(task => {
			this.runTask(task);
		});

		return this.compiler.transformation;
	}

	runTask(task)
	{
		if(typeof this.compiler[task] == 'function') {
			this.compiler[task]();
		} else {
			console.log(`Compile task [${task}] was not found.`);
		}
	}
}