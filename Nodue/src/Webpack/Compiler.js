module.exports = class Compiler
{
	static compiler()
	{
		return new this;
	}

	compileLayoutFiles()
	{
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
	}
}