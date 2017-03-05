module.exports = {'n-hello': {
	template: `
		<div style="color: green;">Hello</div>
	`,
},'n-nav': {
	template: `
		<div class="tabs">
		    <ul>
		    	<n-nav-item href="/">Home</n-nav-item>
		    	<n-nav-item href="/products/show">Products</n-nav-item>
		    </ul>
		</div>
	`,
},'n-nav-item': {
	template: `
		<li :class="{'is-active': isActive }"><a :href="href"><slot></slot></a></li>
	`,
	
	props: ['href'],

	computed: {
		isActive() {
			return this.href == this.$root.activePageUri;
		}
	}
},'n-test': {
	template: `
		<div style="color: red;"><slot></slot></div>
	`,

	props: [
		'text',
	]
},};