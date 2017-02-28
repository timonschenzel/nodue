module.exports = class Compiler
{
	static compiler()
	{
		let compiler = new this;
		compiler.mix = require('laravel-mix').mix;
		compiler.path = require('path');

		return compiler;
	}

	compileLayoutFiles(path)
	{
		let fs = require('fs');
		let files = fs.readdirSync(this.path.normalize(path));

		let layoutTemplates = [];
		let layoutTemplatesString = 'module.exports = {';
		files.forEach(file => {
			let name = file.replace('.vue', '') + '-layout';
			let content = fs.readFileSync(`./resources/layouts/${file}`, 'utf8');
			layoutTemplates[name] = content;

			layoutTemplatesString += "'" + name + "': `" + content + "`,"

			// content = `
			// 	Vue.component('${name}-layout', {
			// 		template: \`
			// 			${content}
			// 		\`
			// 	})
			// `;
		});
		layoutTemplatesString += '};'

		fs.writeFileSync('./storage/framework/cache/layout_templates.js', layoutTemplatesString);
	}

	/**
	 * Laravel mix
	 */
	js(src, output)
	{
		this.mix.js(src, output);

		return this;
	}

	extract(vendorLibs)
	{
		this.mix.extract(vendorLibs);

		return this;
	}

	sass(src, output)
	{
		this.mix.sass(src, output);

		return this;
	}

	less(src, output)
	{
		this.mix.less(src, output);

		return this;
	}

	combine(files, destination)
	{
		this.mix.combine(files, destination);

		this.compileLayoutFiles('resources/layouts');

		return this;
	}

	copy(from, to)
	{
		this.mix.copy(from, to);

		return this;
	}

	minify(file)
	{
		this.mix.minify(file);

		return this;
	}

	sourceMaps()
	{
		this.mix.sourceMaps();

		return this;
	}

	version()
	{
		this.mix.version();

		return this;
	}

	disableNotifications()
	{
		this.mix.disableNotifications();

		return this;
	}

	setCachePath(path)
	{
		this.mix.setCachePath(path);

		return this;
	}
	setPublicPath(path)
	{
		this.mix.setPublicPath(path);

		return this;
	}

	webpackConfig(config)
	{
		this.mix.webpackConfig(config);

		return this;
	}
}

// Laravel mix
// Full API
// mix.js(src, output);
// mix.extract(vendorLibs);
// mix.sass(src, output);
// mix.less(src, output);
// mix.combine(files, destination);
// mix.copy(from, to);
// mix.minify(file);
// mix.sourceMaps(); // Enable sourcemaps
// mix.version(); // Enable versioning.
// mix.disableNotifications();
// mix.setCachePath('some/folder');
// mix.setPublicPath('path/to/public'); <-- Useful for Node apps.
// mix.webpackConfig({}); <-- Override webpack.config.js, without editing the file directly.