module.exports = {
	template: `
		<li :class="{'is-active': isActive }"><a :href="href"><slot></slot></a></li>
	`,
	
	props: ['href'],

	computed: {
		isActive() {
			return this.href == this.$root.activePageUri;
		}
	}
};
