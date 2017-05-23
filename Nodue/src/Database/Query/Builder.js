module.exports = class Builder
{
	constructor(connection)
	{
		// let sqlite3 = require('better-sqlite3');
		// this.db = new sqlite3(database_path('database.sqlite'));

		this._connection = connection;

		this._bindings = {
	        'select': {},
	        'join': {},
	        'where': {},
	        'having': {},
	        'order': {},
	        'union': {},
	    };

		this._columns = ['*'];

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

	raw(sql)
	{
		return sql;
	}

	table(table)
	{
		let builder = new this(this._connection);

		builder._from = table;

		return builder;
	}

	from(table)
	{
		return this.table(table);
	}

	distinct()
	{
		this._distinct = true;

		return this;
	}

	select(...columns)
	{
		this._columns = columns;

		return this;
	}

	where(column, operator = null, value = null)
	{
		let filters = [];

		// Skip operator value, so the operator value will be the compare value
		if (! value && this.operatorIsInvalid(operator)) {
			value = operator;
			operator = '=';
		}

		// Translate seperate parameters into a filter object
		if (typeof column != 'object' && operator && value) {
			filters = [
				[column, operator, value],
			];
		}

		// No filters yet? The column parameter must contain the filters as an object
		if (! filters.length && typeof column == 'object') {
			filters = column;
		}

		// Parse all filters
		collect(filters).forEach((filter, filterColumn) => {
			let column = null;
			let operator = null;
			let value = null;

			// Filter given as a {column: value} object
			if (! /^\d+$/.test(filterColumn)) {
				filter = [filterColumn, filter];
			}

			if (filter.length == 2) {
				column = filter[0];
				operator = '=';
				value = filter[1];
			} else {
				column = filter[0];
				operator = filter[1];
				value = filter[2];
			}

			// Store the where filter
			this._wheres[column] = {
				value: value,
				operator: operator,
			};
		});

		return this;
	}

	first()
	{
		return this.get()[0];
	}

	get()
	{
		return this._connection.prepare(this.prepare()).all(this.bindings());
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

	buildSelectClause()
	{
		let select = 'SELECT ';

		if (this._distinct) {
			select += 'DISTINCT ';
		}

		select += this.buildColumnsClause();

		return select;
	}

	buildColumnsClause()
	{
		return this._columns
			.join(', ')
			.replace(' as ', ' AS ');
	}

	prepareWhereClause()
	{
		let where = '';

		collect(this._wheres).forEach((fieldData, field) => {
			this._bindings['where'][field] = fieldData['value'];

			if (where != '') {
				where += ' AND ';
			}

			where += field + ' ' + fieldData['operator'] + ' :' + field;
		});

		if (! where) {
			return '';
		}

		return ` WHERE ${where}`;
	}

	bindings()
	{
		return this._bindings['where'];
	}

	operatorIsInvalid(operator)
	{
		return ! this._operators.includes(operator);
	}

	toString()
	{
		return `${this.buildSelectClause()} FROM ${this._from}${this.buildWhereClause()}`;
	}

	prepare()
	{
		return `${this.buildSelectClause()} FROM ${this._from}${this.prepareWhereClause()}`;
	}
}
