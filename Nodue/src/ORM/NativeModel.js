module.exports = class NativeModel
{
	constructor()
	{
		let sqlite3 = require('better-sqlite3');
		this.db = new sqlite3(database_path('database.sqlite'));
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
		return this.db.prepare(`SELECT * FROM ${this.table} WHERE ${this.primaryKey} = ?`).get(id);
	}

	all()
	{
		return this.db.prepare(`SELECT * FROM ${this.table}`).all();
	}
}