module.exports = class Model extends Bookshelf.Model
{
	async find(id)
	{
		let v = null;

		let result = await this.where('id', id).fetch().then(result => {
			return result;
		});

		console.log('v');
		console.log(result);
		
		return result;
	}
}