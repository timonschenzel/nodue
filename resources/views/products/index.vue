<app-layout>
	<div>
		Seconds: {{ counter }}<br />
		<button class="button is-primary" @click="replaceFirstProductName">Replace first product name with 'replaced..'</button>
		<hr>
		<a href="/products/create">Create a new product</a>
		<hr>
		<ul>
			<li v-for="(product, index) in shared.products">#{{ product.id }} &mdash; Product name is {{ product.name }}</li>
		</ul>
	</div>
</app-layout>
