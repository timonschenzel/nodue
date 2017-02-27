<homepage-layout>
<!-- 	<template slot="title">My custom title</template>
	<template slot="slogan">My slogan</template> -->

	<p>{{ text }}</p>
	
	<hr />

	<ol>
		<li
			v-for="item in items"
			v-text="item"
		></li>
	</ol>

	<hr>
	<button class="button is-primary" @click="testConsoleLog">console.log - Hello World</button>
	<button class="button is-primary" @click="toggleDivVisibility">Toggle div visibility</button>

	<div v-show="showDiv">
		Toggle Me.
	</div>
</homepage-layout>