counsel_use('VueComponentTestCase');

module.exports = class NodueTestCase extends VueComponentTestCase
{
	constructor()
	{
		super();

		let t = require('ava/lib/test');
		let test = new t({});
		this.ava = test.createExecutionContext();

		this.vm = null;
		this.name = null;

		Vue.config.debug = false;
		Vue.config.silent = true;
	}

	async get(url, callback = null)
	{
		let globalComponents = require('../../../storage/framework/cache/global_components.js');

		for (let componentName in globalComponents) {
			Vue.component(componentName, globalComponents[componentName]);
		}

		let templates = require('../../../storage/framework/cache/layout_templates.js');


		for (let templateName in templates) {
			Vue.component(templateName, {
				template: templates[templateName],
				data() {
					return {};
				}
			});
		}

		Request.track({ url });
		let response = await app.handle(Request);

		let component = {};
		if (response.behavior) {
			eval('component = ' + response.behavior);
		}

		component.template = '<div>' + response.template + '</div>';

		component.data = function()
		{
			return response.data;
		}

		Vue.component('test-component', component);

		let requestResponse = await this.render('<test-component></test-component>', response.options.data);

		if (callback) {
			return callback(requestResponse);
		}

		return requestResponse;
	}
}
