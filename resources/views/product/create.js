{
	data: {
		name: '',
	},

	methods: {
		createProduct()
		{
			socket.emit('postRequest', {
				name: this.name,
			});
		}
	}
}