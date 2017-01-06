route.get('/', 'PagesController@home');
route.get('/products/show', 'ProductController@show');
route.get('/products/index', () => 'test');

route.get('test', () => 'test');