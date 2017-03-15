module.exports = class VueCompilerTest extends TestCase
{
	/** @test */
	is_it_able_to_compile_a_file_as_a_string_and_export_it()
	{
		fs.writeFileSync('./tests/dummy_view.vue', '<div></div>');

		VueCompiler.compile({
			input: './tests/dummy_view.vue',
			output: './tests/compiled_dummy_view.vue',
			compileAsString: true,
		});

		let compiledContent = fs.readFileSync('./tests/compiled_dummy_view.vue', 'utf8');

		this.assertEquals('module.exports = `<div></div>`;', compiledContent);

		fs.unlinkSync('./tests/dummy_view.vue');
		fs.unlinkSync('./tests/compiled_dummy_view.vue');
	}

	/** @test */
	is_it_able_to_merge_all_files_together_as_an_array()
	{
		VueCompiler.compile({
			input: './tests/vue_components',
			output: './tests/merged_components.js',
			globalPrefix: false,
			compileAsString: true,
		});

		let compiledContent = fs.readFileSync('./tests/merged_components.js', 'utf8');

		this.assertEquals(`module.exports = {'nav': \`<ul>
	<n-nav-item>Link 1</n-nav-item>
	<n-nav-item>Link 2</n-nav-item>
	<n-nav-item>Link 3</n-nav-item>
</ul>\`,'nav-item': \`<li><slot></slot></li>\`};`, compiledContent);

		fs.unlinkSync('./tests/merged_components.js');
	}

	/** @test */
	it_is_able_to_compile_components_and_prefix_them()
	{
		VueCompiler.compile({
			input: './tests/vue_components',
			output: './tests/merged_components.js',
			compileAsString: true,
			prefix: 'layout',
		});

		let compiledContent = fs.readFileSync('./tests/merged_components.js', 'utf8');

		this.assertEquals(`module.exports = {'layout-nav': \`<ul>
	<n-nav-item>Link 1</n-nav-item>
	<n-nav-item>Link 2</n-nav-item>
	<n-nav-item>Link 3</n-nav-item>
</ul>\`,'layout-nav-item': \`<li><slot></slot></li>\`};`, compiledContent);

		fs.unlinkSync('./tests/merged_components.js');
	}

	/** @test */
	it_is_able_to_compile_components_and_suffix_them()
	{
		VueCompiler.compile({
			input: './tests/vue_components',
			output: './tests/merged_components.js',
			compileAsString: true,
			suffix: 'layout',
		});

		let compiledContent = fs.readFileSync('./tests/merged_components.js', 'utf8');

		this.assertEquals(`module.exports = {'nav-layout': \`<ul>
	<n-nav-item>Link 1</n-nav-item>
	<n-nav-item>Link 2</n-nav-item>
	<n-nav-item>Link 3</n-nav-item>
</ul>\`,'nav-item-layout': \`<li><slot></slot></li>\`};`, compiledContent);

		fs.unlinkSync('./tests/merged_components.js');
	}

	/** @test */
	it_is_able_to_compile_components_and_add_the_global_prefix()
	{
		VueCompiler.compile({
			input: './tests/vue_components',
			output: './tests/merged_components.js',
			compileAsString: true,
		});

		let compiledContent = fs.readFileSync('./tests/merged_components.js', 'utf8');

		this.assertEquals(`module.exports = {'n-nav': \`<ul>
	<n-nav-item>Link 1</n-nav-item>
	<n-nav-item>Link 2</n-nav-item>
	<n-nav-item>Link 3</n-nav-item>
</ul>\`,'n-nav-item': \`<li><slot></slot></li>\`};`, compiledContent);

		fs.unlinkSync('./tests/merged_components.js');
	}
}
