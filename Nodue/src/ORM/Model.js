module.exports = class Model
{
	constructor()
	{
		// this.bookshelf = Bookshelf.Model.extend(
		// 	this.settings()
		// );
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
		return await db(this.table).where(this.primaryKey, id);

		// return await this.bookshelf.where('id', id[0]).fetch().then(result => {
		//     return result;
		// }).catch(error => {
		//   	console.error(error.stack);
		// });
	}

	async all()
	{
		return await db.select('*').from(this.table);

		// return await this.bookshelf.fetchAll().then(result => {
		//     return result;
		// }).catch(error => {
		//   	console.error(error.stack);
		// });
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