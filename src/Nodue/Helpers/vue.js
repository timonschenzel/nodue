module.exports = {
	view(pathExpression, data)
	{
		var viewPath = pathExpression.split('.').join('/') + '.vue';
		var template = fs.readFileSync(app.basePath + 'resources/views/' + viewPath, 'utf8');

		VueRenderer.renderToString(
			new Vue({
				template,
				data,
				created: function () {
				  var vm = this
				  this.counter++;
				  setInterval(function () {
				  	console.log('hit!');
				    vm.counter += 1
				  }, 1000)
				}
			}),
			function (error, html) {
				global.renderResult = html
			}
		);
	},
}