<div>
	<section class="hero is-primary">
		<div class="hero-body">
			<div class="container">
				<h1 class="title">
					Nodue
				</h1>
				<h2 class="subtitle">
					Homepage
				</h2>
			</div>
		</div>
	</section>

	<div class="container">

		<slot name="nav">
			<navigation>Welcome</navigation>
		</slot>

		<slot></slot>

		<footer-layout></footer-layout>
	</div>
</div>