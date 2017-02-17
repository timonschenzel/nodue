module.exports = class objectTest extends TestCase
{
	get dummyConfig()
	{
		return object({
			'config': {
				'database': {
					'user': 'root',
					'password': 'secret',
					'table': 'nodue',
				},
				'autoload': [
					'path1',
					'path2',
					'path3',
				]
			},
			'files': [
				'file1',
				'file2',
				'file3',
			]
		});
	}

	/** test */
	it_is_able_to_flattern_itself()
	{
		this.assertEquals({
			'config/database/user': 'root',
			'config/database/password': 'secret',
			'config/database/table': 'nodue',
			'config/autoload/0': 'path1',
			'config/autoload/1': 'path2',
			'config/autoload/2': 'path3',
			'files/0': 'file1',
			'files/1': 'file2',
			'files/2': 'file3',
		}, this.dummyConfig.flattern());
	}

	/** test */
	it_is_able_to_find_an_item_within_itself_with_expressive_syntax()
	{
		this.assertEquals('nodue', this.dummyConfig.find('config.database.table'));
	}
}