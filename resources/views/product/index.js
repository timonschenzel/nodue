{
	created()
	{
		console.log('created');

		var vm = this;
		this.counter++;
		setInterval(function () {
		  vm.counter += 1
		}, 1000)
	},

	methods: {
		replaceFirstProductName()
		{
			this.shared.products[0].name = 'Test..';
		}
	}
}