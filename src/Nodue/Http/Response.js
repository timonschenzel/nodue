module.exports = class Request
{
	constructor(response)
	{
		this.response = response;
	}

	send()
	{
		console.log(this.response);
	}
}