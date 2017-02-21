<div>
	<section class="hero is-primary">
		<div class="hero-body">
			<div class="container">
				<h1 class="title">
					Nodue
				</h1>
				<h2 class="subtitle">
					View all products
				</h2>
			</div>
		</div>
	</section>
	
	<hr />

	<div>
		Seconds: {{ counter }}<br />
		<button class="button is-primary" @click="replaceFirstProductName">Replace first product name with 'Test..'</button>
		<hr>
		<ul>
			<li v-for="(product, index) in products">#{{ index }} &mdash; {{ product.name }}</li>
		</ul>
	</div>
</div>