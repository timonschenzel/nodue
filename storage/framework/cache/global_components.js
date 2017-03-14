module.exports = {'n-hello': {
	template: `
		<div style="color: green;">Hello</div>
	`,
},'n-nav': {
	template: `
		<div class="tabs">
		    <ul>
		    	<n-nav-item href="/">Home</n-nav-item>
		    	<n-nav-item href="/product">Products</n-nav-item>
		    	<n-nav-item href="/product/1">Product 1</n-nav-item>
		    	<n-nav-item href="/product/2">Product 2</n-nav-item>
		    	<n-nav-item href="/product/3">Product 3</n-nav-item>
		    	<n-nav-item href="/product/4">Product 4</n-nav-item>
		    	<n-nav-item href="/product/5">Product 5</n-nav-item>
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