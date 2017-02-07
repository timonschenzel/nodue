// global.app = require('../../../bootstrap/app');

// app.basePath = __dirname + '/../../../';

// app.bootstrap();

module.exports = class AppTest
{
	// constructor()
	// {
	// 	super(t => {
	// 		t.deepEqual([1, 2], [1, 2]);
	// 	});
	// }

	it_is_able_to_set_the_env()
	{
		this.assertEqual(1, 2);
	}
}

// let c = new AppTest;