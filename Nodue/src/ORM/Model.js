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

	save()
	{
		return this.bookshelf.save();
	}

	async find(id)
	{
		return await db(this.table).where(this.primaryKey, id);

		// let results = DB.query(`select * from ${this.table} where ${this.primaryKey} = ${id} limit 1`).all();
		// return results[0];
	}

	async all()
	{
		return await db.select('*').from(this.table);

		// return DB.query(`select * from ${this.table}`).all();
	}

	async take(limit = 10)
	{
		return await db.select('*').from(this.table).limit(limit);

		// return DB.query(`select * from ${this.table} limit ${limit}`).all();
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
