module.exports = `<app-layout>
	<template slot="title">Nodue</template>
	<template slot="slogan">{{ product.name }}</template>

	<div>
		<h2>{{ product.name }}&nbsp;&mdash;&nbsp;#{{ product.id }}</h2>
		<p>Product name is {{ product.name }}</p>
		<hr>
		<button class="button is-primary" @click="log">Log something</button>
		<hr>
	</div>
</app-layout>`;
