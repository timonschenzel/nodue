module.exports = `<app-layout>
	<template slot="title">Nodue</template>
	<template slot="slogan">View all products</template>

	<div>
		Seconds: {{ counter }}<br />
		<button class="button is-primary" @click="replaceFirstProductName">Replace first product name with 'Test..'</button>
		<hr>
		<ul>
			<li v-for="(product, index) in products">#{{ index }} &mdash; {{ product.name }}</li>
		</ul>
	</div>
</app-layout>`;