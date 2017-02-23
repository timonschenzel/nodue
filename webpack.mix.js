let mix = require('laravel-mix').mix;

/**
 * Compile layout files.
 */
let fs = require('fs');
let files = fs.readdirSync('./resources/views/layout');

let layoutTemplates = [];
let layoutTemplatesString = 'module.exports = {';
files.forEach(file => {
	let name = file.replace('.vue', '') + '-layout';
	let content = fs.readFileSync(`./resources/views/layout/${file}`, 'utf8');
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

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for your application, as well as bundling up your JS files.
 |
 */

mix.js('resources/assets/js/main.js', 'public/js');

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
