window.Nodue = require('../../../Nodue/src/Frontend/Nodue').boot();

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

window.vm = new Vue({
	el: '#app',
	data: {
		activeComponent: false,
		activePageUri: false,
	},
});
