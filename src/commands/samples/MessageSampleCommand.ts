import {
	ApplicationCommandType,
	MessageContextMenuCommandInteraction,
} from 'discord.js'
import Command from '../../lib/Command'
import { Client } from '../../lib/Client'
import { t } from 'i18next'

export default new Command(
	{
		name: t('commands:samples.message-sample.name', { lng: 'en' }).slice(
			0,
			32
		),
		nameLocalizations: {
			uk: t('commands:samples.message-sample.name', { lng: 'uk' }).slice(
				0,
				32
			),
		},
		type: ApplicationCommandType.Message,
		dm_permission: true,
	},
	async (
		_client: Client,
		interaction: MessageContextMenuCommandInteraction<'cached'>
	) => {
		const { targetId, targetMessage } = interaction

		return await interaction.reply({
			content: `${targetId} => ${targetMessage}`,
		})
	},
	{
		cooldown: 0,
		ownerOnly: false,
		devGuildOnly: true,
		bot_permissions: ['ViewChannel', 'SendMessages'],
	}
)
