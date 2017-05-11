module.exports = class PagesController extends Controller
{
	home()
	{
		return view('pages.home', {
			showDiv: true,
			title: 'Nodue',
			slogan: 'This is great!',
			text: 'Welcome World',
			items: [
				'Go to the store',
				'Shopping?',
				'Sleeping',
			],
			newItem: '',
			shareWithLayout: false,
			layoutData: {
				title: 'Nodue',
				slogan: 'This is amazing!',
			},
		});
	}

	contact(message)
	{
		return `Contact page, message: ${message}`;
	}

	hello()
	{
		return `Hello World.`;
	}
}