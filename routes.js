Route.get('/', 'PagesController@home');
Route.get('/products/show', 'ProductController@show');
Route.get('/products/index', () => 'test');

Route.get('/test', () => 'test');