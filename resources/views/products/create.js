{
	data: {
		name: '',
	},

	methods: {
		createProduct()
		{
			socket.emit('postRequest', {
				name: this.name,
				_url: 'products',
			});
		}
	}
}