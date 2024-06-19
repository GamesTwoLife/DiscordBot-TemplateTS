import { AutocompleteInteraction } from 'discord.js'
import { Client } from '../../../lib/Client'
import Autocomplete from '../../../lib/components/Autocomplete'

export default new Autocomplete(
	'sample',
	async (client: Client, interaction: AutocompleteInteraction) => {
		const { options } = interaction

		const choices = [
			'Popular Topics: Threads',
			'Sharding: Getting started',
			'Library: Voice Connections',
			'Interactions: Replying to slash commands',
			'Popular Topics: Embed preview',
		]

		const focusedValue = options.getFocused()
		if (focusedValue.length === 0) {
			return interaction.respond(
				choices.map((choice) => ({ name: choice, value: choice }))
			)
		}

		const filtered = choices.filter((choice) =>
			choice.startsWith(focusedValue)
		)

		return await interaction.respond(
			filtered.map((choice) => ({ name: choice, value: choice }))
		)
	},
	{
		ownerOnly: false,
		devGuildOnly: false,
	}
)
