module.exports = class NativeModel
{
	constructor()
	{
		this.builder = app.make('db');
	}

	get table()
	{
		return pluralize(this.constructor.name);
	}

	get primaryKey()
	{
		return 'id';
	}

	find(id)
	{
		return this.builder.query(`SELECT * FROM ${this.table} WHERE ${this.primaryKey} = ?`).get(id);
	}

	all()
	{
		return this.builder.query(`SELECT * FROM ${this.table}`).all();
	}
}