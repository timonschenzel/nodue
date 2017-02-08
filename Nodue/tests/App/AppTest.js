module.exports = class AppTest extends TestCase
{
	/** test */
	test_it_is_able_to_set_the_env()
	{
		this.assertDeepEqual(1, 1);
		this.assertTrue(true);
	}

	test_it_is_able_to_check_this_status()
	{
		this.assertDeepEqual(1, 1);
		this.assertTrue(false);
	}
}