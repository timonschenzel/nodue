{
	created()
	{
		console.log('created');
	},

	methods: {
		testConsoleLog()
		{
			console.log('Hello World');
		},

		toggleDivVisibility()
		{
			// this.showDiv = this.showDiv ? false : true;
			store.commit('toggleDivVisibility');
			this.shared.showDiv = this.shared.showDiv ? false : true;
			console.log(this.store.state.showDiv);
		},

		addItem()
		{
			this.shared.items.push(this.newItem);
			this.newItem = '';
		}
	}
}