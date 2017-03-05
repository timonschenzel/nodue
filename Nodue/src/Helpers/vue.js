module.exports = {
	view(pathExpression, data)
	{
		let basePath = 'resources/views/';

		let viewPath = basePath + pathExpression.split('.').join('/') + '.vue';

		let template = VueCompiler.compile({
			input: viewPath,
			compileAsString: true,
		});

		let behavior = false;
		let behaviorPath = basePath + pathExpression.split('.').join('/') + '.js';
		if (fs.existsSync(behaviorPath)) {
			behavior = fs.readFileSync(behaviorPath, 'utf8');
		}

		return {
			name: pathExpression.split('.').join('-'),
			template: template,
			data: data,
			behavior: behavior,
		};
	},
}