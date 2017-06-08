module.exports = class Logger
{
	success(message)
	{
		console.info(chalk.green(`[nodue] ${message}`));
	}

	info(message)
	{
		console.info(chalk.blue(`[nodue] ${message}`));
	}

	warning(message)
	{
		console.info(chalk.yellow(`[nodue] ${message}`));
	}

	error(message)
	{
		console.info(chalk.red(`[nodue] ${message}`));
	}
}