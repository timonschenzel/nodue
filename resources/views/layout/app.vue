<div>
	<section class="hero is-primary">
		<div class="hero-body">
			<div class="container">
				<h1 class="title">
					<slot name="title"></slot>
				</h1>
				<h2 class="subtitle">
					<slot name="slogan"></slot>
				</h2>
			</div>
		</div>
	</section>

	<div class="container">

		<slot name="nav">
			<navigation></navigation>
		</slot>

		<slot></slot>

		<slot name="footer"></slot>
	</div>
</div>