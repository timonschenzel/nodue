module.exports = class Model
{
	constructor()
	{
		this.setUp();
		this.updates = {};
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

	new()
	{
		this.setUp();

		return new Proxy(this, Nodue.ORM.Proxy);
	}

	save()
	{
		return this.bookshelf.save(this.updates);
	}

	async find(id)
	{
		let row = await this.bookshelf.where('id', id).fetch();

		return new Proxy(row, {
			get(target, property, receiver)
			{
				if (target[property] === undefined) {
					return target.get(property);
				}

				return target[property];
			}
		});
	}

	async all()
	{
		return await this.bookshelf.fetchAll();
	}

	async take(limit = 0)
	{
		return await this.limit(limit, offset);
	}

	async limit(limit = 0)
	{
		return await this.bookshelf.query(gb => {
			gb.limit(limit);
		});
	}

	setUp()
	{
		let bookshelfInstance = Bookshelf.Model.extend(
			this.settings()
		);

		this.bookshelf = new bookshelfInstance;
		bookshelfInstance.nodueModel = this;
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
