module.exports = {
	get(target, property)
	{
		if(property in target) {
		    return target[property];
		} else {
			try {
				if(typeof property == 'string') {
					if(target.hasOwnProperty(property)) {
						return target.property;
					}

					if(App.appFiles.hasOwnProperty(property)) {
						return App.appFiles[property];
					} else if(App.nodueFiles.hasOwnProperty(property)) {
						return App.nodueFiles[property];
					}
				}
			} catch(e) {
				console.log('error!');
			}
		}
	}
};