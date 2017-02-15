Obj.prototype.flattern = function() {
  	let toReturn = {};

  	this.forEach((item, key) => {
  		let objectIsNotEmpty = true;

  		if (Object.getOwnPropertyNames(item).length == 0) {
  			objectIsNotEmpty = false;
  		}

  		if (typeof item == 'object' && objectIsNotEmpty) {

  			let flatObject = Obj(item).flattern();

			flatObject.forEach((subItem, subKey) => {
				toReturn[key + '/' + subKey] = subItem;
			});
  		} else {
  			toReturn[key] = item;
  		}
  	});

  	return Obj(toReturn);
}
