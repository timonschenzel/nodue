Route.get('/', 'PagesController@home');
Route.get('/contact/{message}', 'PagesController@contact');
Route.get('/hello', 'PagesController@hello');

Route.get('products/create', 'ProductsController@create')
Route.post('/products', 'ProductsController@store');

Route.get('/products', 'ProductsController@index');
Route.get('/products/{product}', 'ProductsController@show');

Route.get('/test/{message}', (/*Controller*/ controller, message) => {
	controller.testing();
	return message;
});
