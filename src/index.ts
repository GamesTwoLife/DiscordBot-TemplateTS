import { Client } from './lib/Client'
import Logger from './utils/Logger'
;(async () => {
	console.clear()

	await new Client().connect().catch((error) => new Logger().error(error))

	// Anti-crash
	process.on('unhandledRejection', async (error: Error) => {
		new Logger().error(error)
	})
	process.on('uncaughtException', async (error) => {
		new Logger().error(error)
	})
	process.on('rejectionHandled', async (error: Error) => {
		new Logger().error(error)
	})
	process.on('warning', async (warning) => {
		new Logger().warn(warning)
	})
})()
