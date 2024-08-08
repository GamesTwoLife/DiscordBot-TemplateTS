import {
	ApplicationCommandType,
	UserContextMenuCommandInteraction,
} from 'discord.js'
import Command from '../../lib/Command'
import { Client } from '../../lib/Client'
import { t } from 'i18next'

export default new Command(
	{
		name: t('commands:samples.user-sample.name', { lng: 'en' }).slice(
			0,
			32
		),
		nameLocalizations: {
			uk: t('commands:samples.user-sample.name', { lng: 'uk' }).slice(
				0,
				32
			),
		},
		type: ApplicationCommandType.User,
		dm_permission: true,
	},
	async (
		_client: Client,
		interaction: UserContextMenuCommandInteraction<'cached'>
	) => {
		const { targetId, targetMember, targetUser } = interaction

		return await interaction.reply({
			content: `${targetId} => ${targetMember}/${targetUser}`,
		})
	}
)
