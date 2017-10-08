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
			'loadPretty',
			'loadVuex',
			'loadVue',
			'loadDeepMergeModule',
			'createViewPresentationComponent',
			'createStringPresentationComponent',
			'createObjectPresentationComponent',
			'createGlobalComponents',
			'createLayoutComponents',
			'connectWithServer',
			'mapAnchorElements',
			'handlePopstate',
			'createComponentFunction',
			'processResponse',
			'processExceptionResponse',
			'processLayoutUpdates',
			'processComponentUpdates',
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

	loadPretty()
	{
		window.pretty = require('js-object-pretty-print').pretty;
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

	loadDeepMergeModule()
	{
		window.merge = require('deepmerge');
	}

	createViewPresentationComponent()
	{
		Vue.component('view-presentation', {template: `<div><slot></slot></div>`});
	}
	
	createStringPresentationComponent()
	{
		Vue.component('string-presentation', {template: `
			<section class="hero hero-body is-fullheight is-primary">
				<div class="hero-body">
					<div class="container has-text-centered">
						<h3 class="title is-2">
							<slot></slot>
						</h3>
					</div>
				</div>
			</section>`
		});
	}

	createObjectPresentationComponent()
	{
		Vue.component('object-presentation', {template: `
			<section class="hero hero-body is-fullheight is-primary">
				<div class="hero-body">
					<div class="container">
						<h3 class="title is-2">
							<slot></slot>
						</h3>
					</div>
				</div>
			</section>`
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

			socket.emit('getRequest', {
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
			socket.emit('getRequest', {
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

	processResponse()
	{
		socket.on('response', (response) => {
			if (typeof response === 'object') {
				// Redirect
				if (response.data.redirect) {
					let redirect = response.data.redirect.to;
					history.pushState({ redirect }, null, redirect);
				}

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

				if (component.data) {
					response.data = merge(response.data, component.data);
					delete component.data;
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

	processExceptionResponse()
	{
		socket.on('exceptionResponse', (exceptionHtml) => {
			$('head').html('');
			$('body').html(exceptionHtml);
		});
	}

	processLayoutUpdates()
	{
		socket.on('templateUpdate', (response) => {
			this.createLayoutComponent(response.name, response.template);
		});
	}

	processComponentUpdates()
	{
		socket.on('componentUpdate', (response) => {
			console.log(response);
			createComponent(response.name, response.component);
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