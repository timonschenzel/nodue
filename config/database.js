module.exports = {
	default: env('DB_CONNECTION', 'mysql'),

	connections: {
		sqlite: {
			drive: 'sqlite',
			database: env('DB_DATABASE', database_path('database.sqlite')),
		},

		mysql: {
			drive: 'mysql',
			host: env('DB_HOST', '127.0.0.1'),
			user: env('DB_USER', 'nodue'),
			password: env('DB_PASSWORD', ''),
			database: env('DB_DATABASE', 'nodue'),
			charset: 'utf8',
		},

		pgsql: {
			drive: 'pgsql',
			host: env('DB_HOST', '127.0.0.1'),
			user: env('DB_USER', 'nodue'),
			password: env('DB_PASSWORD', ''),
			database: env('DB_DATABASE', 'nodue'),
			charset: 'utf8',
		},
	}
}