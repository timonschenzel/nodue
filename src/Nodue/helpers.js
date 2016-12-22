module.exports = {
	view(pathExpression, data)
	{
		return new Vue.component(pathExpression, {
			template: [from view file],
			data
		});
	}
}