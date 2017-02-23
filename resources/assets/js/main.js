import Vue from 'vue';
let templates = require('../../../storage/framework/cache/layout_templates.js');
window.$ = require('jquery');
window.merge = require('deepmerge');
var io = require('socket.io-client');
window.socket = io('?url=' + window.location.pathname);

$(document).on('click', 'a', e => {
	e.preventDefault();

	let url = $(e.target).attr('href');

	history.pushState({ url }, null, url);

	socket.emit('pageRequest', {
		url,
	});
});

window.addEventListener('popstate', function(e) {
	let url = '/';
	if (e.state != null && e.state.url != null) {
		url = e.state.url;
	}
	socket.emit('pageRequest', {
		url
	});
});

Vue.component('nav-item', {
	template: `
		<li :class="{'is-active': isActive }"><a :href="href"><slot></a></li>
	`,
	
	props: ['href'],

	computed: {
		isActive() {
			return this.href == this.$root.activePageUri;
		}
	}
})

Vue.component('navigation', {
	template: `
		<div class="tabs">
		    <ul>
		    	<nav-item href="/">Home</nav-item>
		    	<nav-item href="/products/show">Products</nav-item>
		    </ul>
		</div>
	`,
})

for (let template in templates) {
	Vue.component(template, {
		template: templates[template],
	});
}

window.vm = new Vue({
	el: '#app',
	data: {
		activeComponent: false,
		activePageUri: false,
	},
});

window.createComponent = function(name, component)
{
	Vue.component(name, component);
};

socket.on('pageRequest', (response) => {
	if (typeof response === 'object') {
		// Hot reload
		if (response.hot) {
			let currentComponentData = window.vm.$root.$children[0].$data;

			// response.data = merge(response.data, currentComponentData);
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
