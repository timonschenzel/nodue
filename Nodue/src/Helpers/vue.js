module.exports = {
	view(pathExpression, data)
	{
		let basePath = app.path('resources/views/');

		let viewPath = basePath + pathExpression.split('.').join('/') + '.vue';
		let template = fs.readFileSync(viewPath, 'utf8');

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