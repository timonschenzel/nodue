module.exports = class PagesController extends Controller
{
	home()
	{
		return view('pages.home', {
			text: 'Test',
		});
	}
}