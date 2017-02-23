module.exports = class Bootstrap
{
	/**
	 * The bootstrap tasks for Nodue frontend.
	 */
	get tasks()
	{
		return [
			'loadSocketIO',
			'loadjQuery',
			'loadVue',
			'createLayoutComponents',
			'connectWithServer',
			'mapAnchorElements',
			'handlePopstate',
			'createComponentFunction',
			'handleForNewPageContent',
		];
	}

	loadSocketIO()
	{
		window.io = require('socket.io-client');
	}

	loadjQuery()
	{
		window.$ = require('jquery');
	}

	loadVue()
	{
		window.Vue = require('vue');
	}

	createLayoutComponents()
	{
		let templates = require('../../../storage/framework/cache/layout_templates.js');

		for (let template in templates) {
			Vue.component(template, {
				template: templates[template],
			});
		}
	}

	connectWithServer()
	{
		window.socket = io('?url=' + window.location.pathname);
	}

	mapAnchorElements()
	{
		$(document).on('click', 'a', e => {
			e.preventDefault();

			let url = $(e.target).attr('href');

			history.pushState({ url }, null, url);

			socket.emit('pageRequest', {
				url,
			});
		});
	}

	handlePopstate()
	{
		window.addEventListener('popstate', function(e) {
			let url = '/';
			if (e.state != null && e.state.url != null) {
				url = e.state.url;
			}
			socket.emit('pageRequest', {
				url
			});
		});
	}

	createComponentFunction()
	{
		window.createComponent = function(name, component)
		{
			Vue.component(name, component);
		};
	}

	handleForNewPageContent()
	{
		socket.on('pageRequest', (response) => {
			if (typeof response === 'object') {
				// Hot reload
				if (response.hot) {
					let currentComponentData = window.vm.$root.$children[0].$data;
				}

				let component = {};
				if (response.behavior) {
					eval('component = ' + response.behavior);
				}

				component.template = response.template;
				component.data = function()
				{
					return response.data;
				}

				if (vm.$children[0]) {
					vm.$children[0].$destroy();
				}

				createComponent(response.name, component);
				vm.$data.activeComponent = response.name;
				vm.$data.activePageUri = response.url;
			} else {
				$('#app').html(response);
			}
		});
	}
}