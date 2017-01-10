import Vue from 'vue';
window.$ = require('jquery');
var io = require('socket.io-client');
window.socket = io();

// var app = require('express')();
// var http = require('http').Server(app);
// var io = require('socket.io')(http);
// import App from './App.vue';

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

Vue.component('home', {
	template: '<h1>{{ text }}</h1>',
	data() {
		return {
			text: 'Hello World',
		}
	}
});

Vue.component('product', {
	template: '<h1>{{ text }}</h1>',
	data() {
		return {
			text: 'Product',
		}
	}
});

window.vm = new Vue({
  el: '#app',
  // render: h => h(App)
  data: {
  	activeComponent: false,
  },
});

window.createComponent = function(name, template, data)
{
	Vue.component(name, {
		template: template,
		data() {
			return data
		},
		created: function () {
		  var vm = this
		  this.counter++;
		  setInterval(function () {
		    vm.counter += 1
		  }, 1000)
		}
	});
};

socket.on('pageRequest', (response) => {
	console.log(response);
	if (typeof response === 'object') {
		let component = createComponent(response.name, response.template, response.data);
		vm.$data.activeComponent = response.name;
	} else {
		$('#app').html(response);
	}
});

socket.on('FileChanged', (response) => {
	console.log(response);
});