import Vue from 'vue';
window.$ = require('jquery');
window.merge = require('deepmerge');
var io = require('socket.io-client');
window.socket = io('?url=' + window.location.pathname);

$('a').click((e) => {
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

window.vm = new Vue({
  el: '#app',
  data: {
  	activeComponent: false,
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

			response.data = merge(response.data, currentComponentData);
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
	} else {
		$('#app').html(response);
	}
});

socket.on('FileChanged', (response) => {
	console.log(response);
});