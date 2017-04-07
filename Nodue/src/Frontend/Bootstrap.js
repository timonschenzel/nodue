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
			'loadVuex',
			'loadVue',
			'createGlobalComponents',
			'createLayoutComponents',
			'connectWithServer',
			'mapAnchorElements',
			'handlePopstate',
			'createComponentFunction',
			'processNewPageContent',
			'processLayoutUpdates',
			'processSharedDateUpdates',
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

	loadVuex()
	{
		window.Vuex = require('vuex').default;
	}

	loadVue()
	{
		window.Vue = require('vue');

		Vue.use(Vuex);

		window.store = new Vuex.Store({
			state: {
				count: 0,
				showDiv: true,
			},
			mutations: {
				increment (state) {
					state.count++
				},
				toggleDivVisibility(state) {
					state.showDiv = state.showDiv ? false : true;
				},
			},
			getters: {
				showDiv: (state, getters) => {
					return state.showDiv;
				}
			}
		});
	}

	createGlobalComponents()
	{
		let templates = require('../../../storage/framework/cache/global_components.js');

		for (let template in templates) {
			Vue.component(template, templates[template]);
		}
	}

	createLayoutComponents()
	{
		let templates = require('../../../storage/framework/cache/layout_templates.js');

		for (let template in templates) {
			this.createLayoutComponent(template, templates[template]);
		}
	}

	createLayoutComponent(name, template)
	{
		Vue.component(name, {
			template: template,
			data() {
				let data = {};

				if (this.$root.$children[0].layoutData) {
					data = this.$root.$children[0].layoutData;
				} else if (this.$root.$children[0].shareWithLayout !== false) {
					data = this.$root.$children[0].$data;
				} else {
					data = {};
				}

				data.store = store;

				return data;
			}
		});
	}

	connectWithServer()
	{
		window.socket = io('?url=' + window.location.pathname);
	}

	/**
	 * @todo only for internal actions.
	 */
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

	processNewPageContent()
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

				if (! response.data.shared) {
					response.data.shared = {};
				}

				if (! response.data.shared.__dataItems) {
					response.data.shared.__dataItems = {};
				}

				component.watch = {};

				if (response.data.shared) {
					component.watch['shared'] = {
						handler: function (update, oldVal) {
							console.log('update!');
							socket.emit('sharedDataUpdate', {
								item: 'shared',
								url: window.location.pathname,
								payload: update,
							});
						},
						deep: true
					};
				}

				if (component.sharedDataItems) {
					component.sharedDataItems.forEach(sharedDataItem => {
						component.watch[sharedDataItem] = {
							handler: function (update, oldVal, internal = false) {
								console.log(update);
								if (! update.fromServer) {
									socket.emit('sharedDataUpdate', {
										item: sharedDataItem,
										url: window.location.pathname,
										payload: update,
									});
								} else if (typeof update == 'object' && update.payload) {
									console.log('update payload!');
									console.log(this);
									this.watch[sharedDataItem].handler(update.payload, update.payload, true);
								}
							},
							deep: true
						};
					});
				}

				component.template = response.template;
				response.data.store = store;
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

	processLayoutUpdates()
	{
		socket.on('templateUpdate', (response) => {
			console.log('template update!');

			this.createLayoutComponent(response.name, response.template);
		});
	}

	processSharedDateUpdates()
	{
		socket.on('sharedDataUpdate', (update) => {
			console.log('shared date update!');
			let item = update.item;
			if (vm.$children[0] && vm.$children[0].$data[item] != update.payload) {
				vm.$children[0].$data[item] = update;
			}
		});
	}
}