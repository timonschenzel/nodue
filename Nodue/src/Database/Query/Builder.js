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

	static table(table)
	{
		let builder = new this;

		builder._from = table;

		return builder;
	}

	static from(table)
	{
		return Builder.table(table);
	}

	where(field, operator, value = null)
	{
		if (! value && operator) {
			value = operator;
			operator = '=';
		}

		if (field && value) {
			this._wheres[field] = {
				value: value,
				operator: operator,
			};
		}

		if (typeof field == 'object') {
			collect(field).forEach((subValue, subField) => {
				if (typeof subValue == 'object') {
					collect(field).forEach((subSubFilter) => {
						let subSubField = null;
						let subSubOperator = null;
						let subSubValue = null;

						if(subSubFilter.length == 2) {
							subSubField = subSubFilter[0];
							subSubOperator = '=';
							subSubValue = subSubFilter[1];
						} else {
							subSubField = subSubFilter[0];
							subSubOperator = subSubFilter[1];
							subSubValue = subSubFilter[2];
						}

						this._wheres[subSubField] = {
							value: subSubValue,
							operator: subSubOperator,
						};
					});
				} else {
					this._wheres[subField] = {
						value: subValue,
						operator: '=',
					};
				}
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

		collect(this._wheres).forEach((fieldData, field) => {
			if (where != '') {
				where += ' AND ';
			}

			if (typeof fieldData['value'] != 'number' || fieldData['value'].toString().includes('.') || fieldData['value'].toString().includes(',')) {
				fieldData['value'] = '"' + fieldData['value'] + '"';
			}

			where += field + ' ' + fieldData['operator'] + ' ' + fieldData['value'];
		});

		if (! where) {
			return '';
		}

		return ` WHERE ${where}`;
	}

	toString()
	{
		return `SELECT * FROM ${this._from}${this.buildWhereClause()}`;
	}
}