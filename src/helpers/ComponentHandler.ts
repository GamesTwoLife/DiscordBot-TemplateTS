import { Collection } from 'discord.js'
import { readdir, stat } from 'fs/promises'
import { join } from 'path'
import { Client } from '../lib/Client'
import Component from '../lib/Component'
import { InteractionType } from '../types/Component'

export default class ComponentHandler {
	readonly basePath: string
	readonly cache: Collection<string, [Component<InteractionType>]> =
		new Collection()

	constructor(private client: Client) {
		this.client = client
		this.basePath = `${__dirname}/../components`
	}

	async load() {
		for (const module of [
			'autocomplete',
			'buttons',
			'modals',
			'selectmenu',
		]) {
			const modulePath = join(this.basePath, module)

			try {
				const moduleStat = await stat(modulePath)
				if (!moduleStat.isDirectory()) continue
			} catch {
				continue
			}

			for (const folder of await readdir(modulePath)) {
				const files = await readdir(join(modulePath, folder))

				for (const file of files) {
					if (!file.endsWith('.ts') && !file.endsWith('.js')) continue

					try {
						const componentPath = join(modulePath, folder, file)

						const component = (await import(`${componentPath}`))
							.default as Component<InteractionType>
						
						if (component && !component.options) {
							component.options = this.client.config.defaultComponentOptions
						}

						if ('data' in component && 'execute' in component) {
							switch (component.data.type) {
								case 'autocomplete':
									{
										if (
											!this.cache.get(component.data.name)
										) {
											this.cache.set(
												component.data.name,
												[component]
											)
										} else {
											this.cache
												.get(component.data.name)!
												.push(component)
										}
									}
									break

								case 'button':
									{
										if (
											!this.cache.get(
												component.data.customId
											)
										) {
											this.cache.set(
												component.data.customId,
												[component]
											)
										} else {
											this.cache
												.get(component.data.customId)!
												.push(component)
										}
									}
									break

								case 'selectmenu':
									{
										if (
											!this.cache.get(
												component.data.customId
											)
										) {
											this.cache.set(
												component.data.customId,
												[component]
											)
										} else {
											this.cache
												.get(component.data.customId)!
												.push(component)
										}
									}
									break

								case 'modalSubmit':
									{
										if (
											!this.cache.get(
												component.data.customId
											)
										) {
											this.cache.set(
												component.data.customId,
												[component]
											)
										} else {
											this.cache
												.get(component.data.customId)!
												.push(component)
										}
									}
									break
							}
						}
					} catch (error) {
						this.client.logger.error(error as Error)
					}
				}
			}
		}
	}
}
