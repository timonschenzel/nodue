{
	created()
	{
		console.log('created');
	},

	sharedDataItems: [
		'items',
		'showDiv',
	],

	methods: {
		testConsoleLog()
		{
			console.log('Hello World');
		},

		toggleDivVisibility()
		{
			this.showDiv = this.showDiv ? false : true;
			// store.commit('toggleDivVisibility');
			// console.log(this.store.state.showDiv);
		},

		addItem()
		{
			this.items.push(this.newItem);
			this.newItem = '';
		}
	}
}