route.get('/', 'PagesController@home');
route.get('/contact/{message}', 'PagesController@contact');
route.get('/hello', 'PagesController@hello');
route.get('/product', 'ProductController@index');
route.get('/product/{product}', 'ProductController@show');

route.get('/test', () => 'test');