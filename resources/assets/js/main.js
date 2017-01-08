import Vue from 'vue';
var io = require('socket.io-client');

var socket = io('http://localhost:5000');

socket.on("data", function(data) {
    console.log("data event", data);
});
// var app = require('express')();
// var http = require('http').Server(app);
// var io = require('socket.io')(http);
// import App from './App.vue';

window.createComponent = function(name, template, data)
{
	Vue.component(name, { template: template, data() { return data } });
}

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

new Vue({
  el: '#app',
  // render: h => h(App)
  data: {
  	activeComponent: 'home',
  },
});