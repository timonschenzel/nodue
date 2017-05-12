module.exports = class VueComponent
{
	constructor(options = {})
	{
		this.options = options;

		if (! this.options.template) {
			if (this.options.type == 'string') {
				this.options.template = '{{ data }}';
			}

			if (this.options.type == 'object') {
				this.options.data.dump = pretty(this.options.data);
				this.options.template = '<pre>{{ dump }}</pre>';
			}
		}

		this.type = this.options.type;
		this.name = this.options.name;
		this.template = `<${this.type}-presentation>${this.options.template}</${this.type}-presentation>`;
		this.data = this.options.data;
		this.behavior = this.options.behavior;
	}
}
