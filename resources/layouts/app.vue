<div>
	<section class="hero is-primary is-bold">
		<div class="hero-body">
			<div class="container">
				<h1 class="title">
					<slot name="title">{{ this.$root.activeComponent }}</slot>
				</h1>
				<h2 class="subtitle">
					<slot name="slogan">{{ this.$root.activeComponent }}</slot>
				</h2>
			</div>
		</div>
	</section>

	<div class="container">

		<slot name="nav">
			<navigation></navigation>
		</slot>

		<slot></slot>

		<footer-layout></footer-layout>
	</div>
</div>