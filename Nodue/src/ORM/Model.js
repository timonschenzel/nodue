module.exports = class Model
{
	constructor()
	{
		this.bookshelf = Bookshelf.Model.extend(
			this.settings()
		);
	}

	get table()
	{
		return pluralize(this.constructor.name);
	}

	get primaryKey()
	{
		return 'id';
	}

	get timestamps()
	{
		return ['created_at', 'updated_at'];
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

	settings()
	{
		return {
			tableName: this.table,
			idAttribute: this.primaryKey,
			hasTimestamps: this.timestamps,
		}
	}
}