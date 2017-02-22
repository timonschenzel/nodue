# Nodue
Expressive Node.js + Vue.js framework with hot reload

## Install
1. git clone https://github.com/timonSchenzel/nodue.git
2. cd nodue
3. npm install
4. Compile assets with Laravel Mix: `npm run dev` (this will watch for changes) `npm run webpack` will compile assets a single time.

## Start working
You have some options here, if you want to use option 3 or 4 install nodemon globally (`npm install -g nodemon`):
(when also running `npm run dev`, run the following commands in another screen/tab)

1. `npm run nodue` - This will boot Nodue (for production)
2. `npm run nodue hot` - This will boot Nodue with hot reload feature
3. `npm run nodue:dev` - This will boot Nodue with nodemon, nodemon will watch every change (excluded controller/view files) and will reboot Nodue automaticaly when changing something.
4. `npm run nodue:dev hot` - This will boot Nodue with nodemon and hot reload

## Workflow example
For example: you want to create a welcome page.

1. Visit `routes.js` in the root
2. Add `route.get('/', 'PagesController@home');` - url `/` will be mapped to `PagesController` and call his method `home`.
3. Create the controller file `PagesController.js` within the folder: `app/http/controllers`:
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
			showDiv: true,
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
	<hr>
	<button @click="testConsoleLog">console.log - Hello World</button>
	<button @click="toggleDivVisibility">Toggle div visibility</button>

	<div v-show="showDiv">
		Toggle Me.
	</div>
</div>
```

5. View behavior files

View behavior will give us the possibility interact with a view without reloading the page. Something like toggle the visibility from a div element. To create a view behavior file follow this convention: `[name-from-the-view-file].js`.

6. Create the view behavior file `home.js` within `resources/views/pages`:
```vue
{
	created()
	{
		console.log('created');
	},

	methods: {
		testConsoleLog()
		{
			console.log('Hello World');
		},

		toggleDivVisibility()
		{
			this.showDiv = this.showDiv ? false : true;
		}
	}
}
```

6. View files and view behavior files will use Vue.js, for more information view: https://vuejs.org/v2/guide/.

## Hot Reload
The best part.

1. For example: in `PagesController@home`, add `Hot Reloaded` to the `items` array and save it.
2. Our open `home.vue` and add some styling like `<p style="color: red;">{{ text }}</p>` and hit save.
