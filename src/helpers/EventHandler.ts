import { ClientEvents, Events, RESTEvents, RestEvents } from 'discord.js'
import { readdir, stat } from 'fs/promises'
import { join } from 'path'
import { Client } from '../lib/Client'
import Event from '../lib/Event'

export default class EventHandler {
	readonly basePath: string

	constructor(private client: Client) {
		this.client = client
		this.basePath = `${__dirname}/../events`
	}

	async load() {
		for (const folder of await readdir(this.basePath)) {
			const folderPath = join(this.basePath, folder)

			try {
				const moduleStat = await stat(folderPath)
				if (!moduleStat.isDirectory()) continue
			} catch {
				continue
			}

			for (const file of await readdir(folderPath)) {
				if (!file.endsWith('.ts') && !file.endsWith('.js')) continue

				try {
					const eventPath = join(folderPath, file)
					const event = (await import(`${eventPath}`))
						.default as Event<keyof ClientEvents | keyof RestEvents>

					if (
						Object.values(Events).includes(
							event.data.name as Events
						)
					) {
						// Перевірка, чи event.data.name належить до подій ClientEvents
						if (event.data.once) {
							this.client.once(
								event.data.name as keyof ClientEvents,
								(...args: any) => event.execute(this.client, ...args)
							)
						} else {
							this.client.on(
								event.data.name as keyof ClientEvents,
								(...args: any) => event.execute(this.client, ...args)
							)
						}
					} else if (
						Object.values(RESTEvents).includes(
							event.data.name as RESTEvents
						)
					) {
						// Перевірка, чи event.data.name належить до подій RestEvents
						if (event.data.once)
							this.client.rest.once(
								event.data.name as keyof RestEvents,
								(...args: any) => event.execute(this.client, ...args)
							)
						else
							this.client.rest.on(
								event.data.name as keyof RestEvents,
								(...args: any) => event.execute(this.client, ...args)
							)
					}
				} catch (error) {
					this.client.logger.error(error as Error)
				}
			}
		}
	}
}
