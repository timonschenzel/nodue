module.exports = class PagesController extends Controller
{
	home()
	{
		return view('pages.home', {
			showDiv: true,
			title: 'Nodue',
			slogan: 'This is great!',
			text: 'Welcome World',
			newItem: '',
			shareWithLayout: false,
			layoutData: {
				title: 'Nodue',
				slogan: 'This is amazing!',
			},
			shared: {
				showDiv: true,
				items: [
					'Go to the store',
					'Shopping?',
					'Sleeping',
				],
			}
		});
	}

	contact(message)
	{
		return `Contact page, message: ${message}`;
	}
}