module.exports = class Builder
{
	constructor()
	{
		let sqlite3 = require('better-sqlite3');
		this.db = new sqlite3(database_path('database.sqlite'));

		this._connection = null;

		this._binding = {
	        'select': {},
	        'join': {},
	        'where': {},
	        'having': {},
	        'order': {},
	        'union': {},
	    };

		this._columns = {};

		this._distinct = false;

		this._from = null;

		this._joins = {};

		this._wheres = {};

		this._groups = {};

		this._havings = {};

		this._orders = {};

		this._limit = null;

		this._offset = null;

		this._operators = [
	        '=', '<', '>', '<=', '>=', '<>', '!=',
	        'like', 'like binary', 'not like', 'between', 'ilike',
	        '&', '|', '^', '<<', '>>',
	        'rlike', 'regexp', 'not regexp',
	        '~', '~*', '!~', '!~*', 'similar to',
	        'not similar to', 'not ilike', '~~*', '!~~*',
	    ];
	}

	from(table)
	{
		this._from = table;

		return this;
	}

	where(field, value = null)
	{
		if (field && value) {
			this._wheres[field] = value;
		}

		if (typeof field == 'object') {
			collect(field).forEach((subValue, subField) => {
				this._wheres[subField] = subValue;
			});
		}

		return this;
	}

	first()
	{
		return this.get()[0];
	}

	get()
	{
		return this.db.prepare(`SELECT * FROM ${this._from} WHERE ${this.buildWhereClause()}`).all();
	}

	buildWhereClause()
	{
		let where = '';

		collect(this._wheres).forEach((value, field) => {
			if (where != '') {
				where += ' AND ';
			}

			if (typeof value != 'number' || value.toString().includes('.') || value.toString().includes(',')) {
				value = '"' + value + '"';
			}

			where += field + ' = ' + value;
		});

		return where;
	}

	toString()
	{
		return `SELECT * FROM ${this._from} WHERE ${this.buildWhereClause()}`;
	}
}