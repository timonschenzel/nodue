<div>
	Seconds: {{ counter }}
	<button @click="test">Test</button>
	<hr>
	<ul>
		<li v-for="product in products">{{ product.name }}</li>
	</ul>
</div>