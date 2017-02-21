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
			this.showDiv = this.showDiv ? false : true;
		}
	}
}