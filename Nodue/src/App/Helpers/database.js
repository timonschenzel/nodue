module.exports = {
	database_path(additionalPath)
	{
		return app.path('database/' + additionalPath);
	}
}