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

	find(id)
	{
		let results = DB.query(`select * from ${this.table} where ${this.primaryKey} = ${id} limit 1`).all();
		return results[0];
	}

	all()
	{
		return DB.query(`select * from ${this.table}`).all();
	}

	take(limit = 10)
	{
		return DB.query(`select * from ${this.table} limit ${limit}`).all();
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
