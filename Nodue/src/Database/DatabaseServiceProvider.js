module.exports = class DatabaseServiceProvider
{
	register(app)
	{
		// let sqlite3 = require('better-sqlite3');
		// let connection = new sqlite3(database_path('database.sqlite'));

		// app.singleton('db.connection', connection);

		app.bind('db', function(app) {
			return new Nodue.Database.Query.Builder(db);
		});
	}
}