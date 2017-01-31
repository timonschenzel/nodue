<div>
	Seconds: {{ counter }}
	<button @click="test">Test</button>
	<hr>
	<ul>
		<li v-for="(product, index) in products">#{{ index }} &mdash; {{ product.name }}</li>
	</ul>
</div>