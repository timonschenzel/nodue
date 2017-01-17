# Nodue
Expressive Node.js + Vue.js framework with hot reload

## Install
1. git clone https://github.com/timonSchenzel/nodue.git
2. cd nodue
3. npm update

## Start working
You have some options here, if you want to use option 3 or 4 install nodemon (`npm install -g nodemon`):

1. `npm run nodue` - This will boot Nodue (for production)
2. `npm run nodue hot` - This will boot Nodue with hot reload feature
3. `npm run nodue:dev` - This will boot Nodue with nodemon, nodemon will watch every change (excluded controller/view files) and will reboot Nodue automaticaly when changing something.
4. `npm run nodue:dev hot` - This will boot Nodue with nodemon and hot reload

## Workflow example
For example: you want to create a welcome page.

1. View `routes`.js in the root
2. Add `route.get('/', 'PagesController@home');` - url `/` will be mapped to `PagesController` and call his method `home`.
3. Create the controller file `PagesController,js` within the folder: `app/http/controllers`:
```javascript
module.exports = class PagesController extends Controller
{
	home()
	{
		return view('pages.home', {
			title: 'Nodue',
			text: 'This is great!',
			items: [
				'Nodue',
				'Vue.js',
				'Node.js',
			],
		});
	}
}
```

4. Create the view file `home.vue` within `resources/views/pages`:
```vue
<div>
	<h1>{{ title }}</h1>
	<p>{{ text }}</p>
  
	<ul>
		<li
			v-for="item in items"
			v-text="item"
		></li>
	</ul>
</div>
```

## Hot Reload
The best part.

1. For example: in `PagesController@home`, add `Hot Reloaded` to the `items` array and save it.
2. Our open `home.vue` and add some styling like `<p style="color: red;">{{ text }}</p>` and hit save.
