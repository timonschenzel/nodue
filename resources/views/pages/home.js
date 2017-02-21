{
	created()
	{
		console.log('created');
	},

	methods: {
		testConsoleLog()
		{
			console.log('test');
		},

		toggleDivVisibility()
		{
			this.showDiv = this.showDiv ? false : true;
		}
	}
}