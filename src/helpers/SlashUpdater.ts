import { REST, Routes, APIApplicationCommand } from 'discord.js'
import { Client } from '../lib/Client'

export default class SlashUpdater {
	constructor(private client: Client) {
		this.client = client
	}

	async load() {
		const rest = new REST({ version: '10' }).setToken(
			this.client.config.token
		)

		const commandsOnlyTestGuildJSONData = this.client.commands.cache
			.filter((cmd) => cmd.options?.devGuildOnly === true)
			.map((c) => c.data)
		const commandsJSONData = this.client.commands.cache
			.filter((cmd) => cmd.options?.devGuildOnly === false)
			.map((c) => c.data)

		if (
			commandsJSONData.length === 0 &&
			commandsOnlyTestGuildJSONData.length > 0
		) {
			this.client.logger.log(
				`Updating ${commandsOnlyTestGuildJSONData.length} of the program's guild commands has started.`
			)

			const [data_test_guild] = (await Promise.all([
				rest.put(
					Routes.applicationGuildCommands(
						this.client.config.clientId,
						this.client.config.guildId
					),
					{ body: commandsOnlyTestGuildJSONData }
				),
				rest.put(
					Routes.applicationCommands(this.client.config.clientId),
					{ body: [] }
				),
			])) as [APIApplicationCommand][]

			this.client.logger.log(
				`Successfully updated ${data_test_guild.length} of the program's guild commands.`
			)
		} else if (
			commandsOnlyTestGuildJSONData.length === 0 &&
			commandsJSONData.length > 0
		) {
			this.client.logger.log(
				`Updating ${commandsJSONData.length} of the program's global commands has started.`
			)

			const [data] = (await Promise.all([
				rest.put(
					Routes.applicationCommands(this.client.config.clientId),
					{ body: commandsJSONData }
				),
				rest.put(
					Routes.applicationGuildCommands(
						this.client.config.clientId,
						this.client.config.guildId
					),
					{ body: [] }
				),
			])) as [APIApplicationCommand][]

			this.client.logger.log(
				`Successfully updated ${data.length} of the program's global commands.`
			)
		} else {
			this.client.logger.log(
				`Updating ${commandsJSONData.length} global and ${commandsOnlyTestGuildJSONData.length} guild commands of the program.`
			)

			const [data_test_guild, data] = (await Promise.all([
				rest.put(
					Routes.applicationGuildCommands(
						this.client.config.clientId,
						this.client.config.guildId
					),
					{ body: commandsOnlyTestGuildJSONData }
				),
				rest.put(
					Routes.applicationCommands(this.client.config.clientId),
					{ body: commandsJSONData }
				),
			])) as [APIApplicationCommand[], APIApplicationCommand[]]

			this.client.logger.log(
				`Successfully updated ${data.length} global and ${data_test_guild.length} guild commands of the program.`
			)
		}
	}

	/**
	 * @todo реалізувати реєстрацію команд (для вимкнення певних команд на певних серверах)
	 */
	async testLoad(guildId: string) {
		/*
			const rest = new REST({ version: '10' }).setToken(
				this.client.config.token
			)
			const guild_db = await this.client.db.guilds.getGuild(guildId)
			const commandsJSONData = guild_db.commands.map((c) => c.data)
			
			if (
				commandsJSONData.length > 0
			) {
				const [data] = (await Promise.all([
					rest.put(
						Routes.applicationCommands(this.client.config.clientId),
						{ body: commandsJSONData }
					),
					rest.put(
						Routes.applicationGuildCommands(
							this.client.config.clientId,
							this.client.config.guildId
						),
						{ body: [] }
					),
				])) as [APIApplicationCommand][]
				 
				return data
			}
		*/
	}
}
