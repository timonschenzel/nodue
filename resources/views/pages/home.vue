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
	<button @click="test">My Button</button>
	<button @click="hideDiv">Hide div</button>

	<div v-show="showDiv">
		Hide Me.
	</div>
</div>