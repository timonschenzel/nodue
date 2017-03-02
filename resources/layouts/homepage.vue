<div>
	<section class="hero is-primary">
		<div class="hero-body">
			<div class="container">
				<h1 class="title">
					<slot name="title">{{ title || 'Default title' }}</slot>
				</h1>
				<h2 class="subtitle">
					<slot name="slogan">{{ slogan || 'Default slogan' }}</slot>
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
		TEST2
	</div>
</div>