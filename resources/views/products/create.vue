<app-layout>
	<template slot="title">Nodue</template>
	<template slot="slogan">Create a product</template>

	<div>
		<input type="text" v-model="name" placeholder="Name">
		<button @click="createProduct">Create product</button>
	</div>
</app-layout>