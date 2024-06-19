import {
	Interaction,
	AutocompleteInteraction,
	InteractionType,
} from 'discord.js'
import { Client } from '../../lib/Client'
import Event from '../../lib/Event'
import Component from '../../lib/Component'

export default new Event(
	{
		name: 'interactionCreate',
	},
	async (client: Client, interaction: Interaction) => {
		if (!interaction.isAutocomplete()) return
		if (interaction.type !== InteractionType.ApplicationCommandAutocomplete)
			return

		try {
			const autocompletes = client.components.cache
				.get(interaction.commandName)
				?.filter((component) => component.data.type === 'autocomplete')

			if (!autocompletes || autocompletes.length === 0) return

			for (const autocomplete of autocompletes) {
				return await (
					autocomplete as Component<AutocompleteInteraction<'cached'>>
				).execute(
					client,
					interaction as AutocompleteInteraction<'cached'>
				)
			}
		} catch (error) {
			if (error instanceof Error) {
				client.logger.error(error as Error)
			}
		}
	}
)
