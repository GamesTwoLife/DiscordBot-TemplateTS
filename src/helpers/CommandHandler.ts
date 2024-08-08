import { Collection } from 'discord.js'
import { readdir, stat } from 'fs/promises'
import { join } from 'path'
import { Client } from '../lib/Client'
import Command from '../lib/Command'
import { InteractionType } from '../types/Command'

export default class CommandHandler {
	readonly basePath: string
	readonly cache: Collection<string, Command<InteractionType>> =
		new Collection()

	constructor(private client: Client) {
		this.client = client
		this.basePath = `${__dirname}/../commands`
	}

	async load() {
		for (const module of await readdir(this.basePath)) {
			const modulePath = join(this.basePath, module)

			try {
				const moduleStat = await stat(modulePath)
				if (!moduleStat.isDirectory()) continue
			} catch {
				continue
			}

			const commandFiles = await readdir(modulePath)

			for (const commandFile of commandFiles) {
				if (
					!commandFile.endsWith('.ts') &&
					!commandFile.endsWith('.js')
				)
					continue

				try {
					const commandPath = join(modulePath, commandFile)

					const command = (await import(`${commandPath}`))
						.default as Command<InteractionType>
						
					if (command && !command.options) {
						command.options = this.client.config.defaultCommandOptions
					}

					if ('data' in command && 'execute' in command) {
						this.cache.set(command.data.name, command)
					}
				} catch (error) {
					this.client.logger.error(error as Error)
				}
			}
		}
	}
}
