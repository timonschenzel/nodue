Route.get('/', 'PagesController@home');
Route.get('/contact/{message}', 'PagesController@contact');
Route.get('/hello', 'PagesController@hello');
Route.get('/product', 'ProductController@index');
Route.get('/product/{product}', 'ProductController@show');

Route.get('/test/{message}', (/*Controller*/ controller, message) => {
	controller.testing();
	return message;
});