module.exports = {'navigation': `{
	template: \`
		<div class="tabs">
		    <ul>
		    	<nav-item href="/">Home</nav-item>
		    	<nav-item href="/products/show">Products</nav-item>
		    </ul>
		</div>
	\`,
};
`,'nav-item': `{
	template: \`
		<li :class="{'is-active': isActive }"><a :href="href"><slot></slot></a></li>
	\`,
	
	props: ['href'],

	computed: {
		isActive() {
			return this.href == this.$root.activePageUri;
		}
	}
};
`,};