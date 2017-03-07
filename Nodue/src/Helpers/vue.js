module.exports = {
	view(pathExpression, data)
	{
		let basePath = 'resources/views/';
		let viewPathStructure = pathExpression.split('.').join('/');
		let viewPath = basePath + viewPathStructure + '.vue';
		let fullViewPath = app.path(viewPath);
		let viewCachePath = app.path(app.config('app.cacheFolder') + '/views/' + viewPathStructure + '.js');

		if (! fs.existsSync(viewCachePath)) {
			AssetsCompiler.compileViewFile(fullViewPath);
		}
		
		let template = require(viewCachePath);

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