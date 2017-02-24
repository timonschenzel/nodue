module.exports = {'app-layout': `<div>
	<section class="hero is-primary is-bold">
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

		<footer-layout></footer-layout>
	</div>
</div>`,'footer-layout': `<footer class="footer">
	<div class="container">
		<div class="content has-text-centered">
			<p>
				<strong>Nodue</strong>
				by <a href="https://github.com/timonSchenzel/nodue">Timon Schenzel</a>. The source code is licensed
				<a href="http://opensource.org/licenses/mit-license.php">MIT</a>. The website content
				is licensed <a href="http://creativecommons.org/licenses/by-nc-sa/4.0/">CC ANS 4.0</a>.
			</p>
			<p>
				<a class="icon" href="https://github.com/jgthms/bulma">
				<i class="fa fa-github"></i>
			</a>
			</p>
		</div>
	</div>
</footer>`,'homepage-layout': `<div>
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
</div>`,};