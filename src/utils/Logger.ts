import pino from 'pino'
import colors from 'colors'

export default class Logger {
	private logger = pino()
	private getTime(): string {
		return new Date().toLocaleTimeString()
	}

	log(message: any) {
		this.logger.info(
			colors.cyan(`${colors.gray(this.getTime())}: `) + message
		)
	}

	info(message: any) {
		this.logger.info(`${colors.gray(this.getTime())}: ` + message)
	}

	debug(message: any) {
		this.logger.debug(`${colors.gray(this.getTime())}: ` + message)
	}

	warn(message: any) {
		this.logger.warn(`${colors.gray(this.getTime())}: ` + message)
	}

	error(message: string | Error) {
		if (message instanceof Error) {
			this.logger.error(
				colors.red(`${colors.gray(this.getTime())}: `) +
					message.name +
					message.message +
					'\n' +
					(!message?.stack
						? ''
						: message.stack
								.split('\n')
								.map((str) => `> ${str}`)
								.join('\n'))
			)
		} else {
			this.logger.error(`${colors.gray(this.getTime())}: ` + message)
		}
	}
}
