module.exports = class Database
{
	static init()
	{
		let db = new this;

		db.config = db.getConfig();

		let configurationMethod = db.config.driver + 'Configuration';

		db[configurationMethod]();

		return db;
	}

	settings()
	{
		return this._settings;
	}

	sqliteConfiguration()
	{
		this._settings = {
			client: 'sqlite3',
			connection: {
				filename: this.config.database,
			},
			useNullAsDefault: true
		};
	}

	mysqlConfiguration()
	{
		this._settings = {
			client: this.config.driver,
			connection: {
				host: this.config.host,
				user: this.config.user,
				password: this.config.password,
				database: this.config.database,
				charset: this.config.charset,
			},
		};
	}

	pgsqlConfiguration()
	{
		this._settings = {
			client: this.config.driver,
			connection: {
				host: this.config.host,
				user: this.config.user,
				password: this.config.password,
				database: this.config.database,
				charset: this.config.charset,
			},
		};
	}

	getConfig()
	{
		let databaseConfig = app.getConfig('database');
		return databaseConfig['connections'][databaseConfig['default']];
	}
}