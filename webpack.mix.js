let mix = require('./Nodue/src/Webpack/Compiler').compiler();

let fs = require('fs');

let layoutFiles = fs.readdirSync('./resources/layouts').filter(function(file) {
    return file.match(/.*\.vue$/);
});

layoutFiles = layoutFiles.map(entry => {
	return `./resources/layouts/${entry}`;
});

// mix.compileLayoutFiles();
// let mix = require('laravel-mix').mix;

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

mix.js('Nodue/src/Frontend/app.js', 'public/js')
	.sass('resources/assets/sass/app.sass', 'public/css')
	.combine(layoutFiles, 'public/layout_files.js');

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
