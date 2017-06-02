module.exports = {
	env(key,override=false){
		let value=process.env[key.toUpperCase()];
		if(!value)
		{
		return override;
		}
		return value;
	}
}