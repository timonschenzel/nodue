<div>
	<h1>{{ title }}</h1>
	<p>{{ slogan }}</p>
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