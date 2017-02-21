<div>
	<section class="hero is-primary">
		<div class="hero-body">
			<div class="container">
				<h1 class="title">
					{{ title }}
				</h1>
				<h2 class="subtitle">
					{{ slogan }}
				</h2>
			</div>
		</div>
	</section>

	<hr />
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
</div>