<div>
	Seconds: {{ counter }}
	<button @click="replaceFirstProductName">Replace first product name with 'Test..'</button>
	<hr>
	<ul>
		<li v-for="(product, index) in products">#{{ index }} &mdash; {{ product.name }}</li>
	</ul>
</div>