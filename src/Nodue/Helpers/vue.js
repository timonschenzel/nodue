module.exports = {
	view(pathExpression, data)
	{
		var viewPath = pathExpression.split('.').join('/') + '.vue';
		var template = fs.readFileSync(app.basePath + 'resources/views/' + viewPath, 'utf8');

		return {
			name: pathExpression.split('.').join('-'),
			template: template,
			data: data,
		};
	},
}