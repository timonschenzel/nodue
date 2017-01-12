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
</div>