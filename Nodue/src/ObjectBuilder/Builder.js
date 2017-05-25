module.exports = class Builder
{
	build(object)
	{
		let constructorRegex = new RegExp(
		  /constructor\s?\((\s?.*\s?)\)/,
		  'gim'
		);

		let parameters = constructorRegex
			.exec(object.toString());
		
		if (parameters == null) {
			parameters = [];
		}

		if (parameters[1]) {
			parameters = parameters[1]
				.replace(/\s/g,'')
				.replace(/\/\*/g, '')
				.replace(/\*\//g, ' ')
				.split(',');
		}

		let parameterValues = [];
		let typeHint = null;
		let typeHintObject = null;

		parameters.forEach(parameter => {
			if (parameter.includes(' ')) {
				let typeHint = parameter.split(' ')[0];

				let typeHintObject = this.build(eval(typeHint));

				parameterValues.push(typeHintObject);
			}
		});

		return new object(...parameterValues);
	}
}
