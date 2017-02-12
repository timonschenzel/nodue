String.prototype.capitalize = function capitalize() {
	return this.charAt(0).toUpperCase() + this.slice(1);
};