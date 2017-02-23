module.exports = class Nodue
{
	static boot()
	{
		let nodue = new this;
		let bootstrapper = require('./Bootstrap');
		nodue.bootstrapper = new bootstrapper;
		nodue.bootstrap();

		return nodue;
	}

	bootstrap()
	{
		this.bootstrapper.tasks.forEach(task => {
			this.runBootstrapTask(task);
		});
	}

	runBootstrapTask(task)
	{
		if(typeof this.bootstrapper[task] == 'function') {
			this.bootstrapper[task]();
		} else {
			console.log(`Bootstrap task [${task}] was not found.`);
		}
	}
}