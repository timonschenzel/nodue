module.exports = class Model
{
	constructor()
	{
		let bookshelf = Bookshelf.Model;
		bookshelf.model = this;
		this.bookshelf = new Proxy(bookshelf, Nodue.ORM.ModelProxy);
	}

	async find(id)
	{
		return await this.bookshelf.where('id', id).fetch().then(result => {
			return result;
		});
	}

	async all()
	{
		return await this.bookshelf.fetchAll().then(result => {
			return result;
		})
	}
}