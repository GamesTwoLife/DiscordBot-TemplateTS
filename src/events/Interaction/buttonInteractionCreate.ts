import {
	Interaction,
	ButtonInteraction,
	User,
	GuildMember,
	Guild,
	EmbedBuilder,
} from 'discord.js'
import { Client } from '../../lib/Client'
import Event from '../../lib/Event'
import Component from '../../lib/Component'

export default new Event(
	{
		name: 'interactionCreate',
	},
	async (client: Client, interaction: Interaction) => {
		if (!interaction.isButton()) return

		try {
			const now = Date.now()

			const user = interaction.user as User
			const member = interaction.member as GuildMember
			const guild = interaction.guild as Guild

			const buttons = client.components.cache
				.get(interaction.customId)
				?.filter((component) => component.data.type === 'button')

			if (!buttons || buttons.length === 0) {
				const savedInteraction =
					await client.db.interactions.getInteraction(
						guild.id,
						interaction.message.id
					)

				if (!savedInteraction) {
					return await interaction.reply({
						embeds: [
							new EmbedBuilder()
								.setColor(client.config.colors.error)
								.setAuthor({
									name: client.localization.t(
										'common:interactionError',
										{ lng: interaction.locale }
									),
								})
								.setDescription(
									client.localization.t(
										'common:unknownInteraction',
										{ lng: interaction.locale }
									)
								)
								.setTimestamp(),
						],
						ephemeral: true,
					})
				} else if (
					savedInteraction &&
					new Date() >= savedInteraction.expiresAt
				) {
					return await interaction.reply({
						embeds: [
							new EmbedBuilder()
								.setColor(client.config.colors.error)
								.setAuthor({
									name: client.localization.t(
										'common:interactionError',
										{ lng: interaction.locale }
									),
								})
								.setDescription(
									client.localization.t(
										'common:expiredInteraction',
										{ lng: interaction.locale }
									)
								)
								.setTimestamp(),
						],
						ephemeral: true,
					})
				}

				return
			}

			for (const button of buttons) {
				client.logger.log(button)
				if (
					button.options &&
					button.options.ownerOnly &&
					!client.config.developers.includes(user.id)
				) {
					return await interaction.reply({
						embeds: [
							new EmbedBuilder()
								.setColor(client.config.colors.error)
								.setAuthor({
									name: client.localization.t(
										'common:interactionError',
										{ lng: interaction.locale }
									),
								})
								.setDescription(
									client.localization.t(
										'common:buttonOnlyDeveloper',
										{ lng: interaction.locale }
									)
								)
								.setTimestamp(),
						],
						ephemeral: true,
					})
				}

				if (
					button.options &&
					button.options.devGuildOnly &&
					client.config.guildId !== guild.id
				) {
					return await interaction.reply({
						embeds: [
							new EmbedBuilder()
								.setColor(client.config.colors.error)
								.setAuthor({
									name: client.localization.t(
										'common:interactionError',
										{ lng: interaction.locale }
									),
								})
								.setDescription(
									client.localization.t(
										'common:buttonOnlyDevGuild',
										{ lng: interaction.locale }
									)
								)
								.setTimestamp(),
						],
						ephemeral: true,
					})
				}

				if (
					button.options &&
					button.options.bot_permissions &&
					!guild.members.me!.permissions.has(
						button.options?.bot_permissions
					)
				) {
					const permsBot = button.options?.bot_permissions
						?.map((x) => x)
						.join(', ')

					return await interaction.reply({
						embeds: [
							new EmbedBuilder()
								.setColor(client.config.colors.error)
								.setAuthor({
									name: client.localization.t(
										'common:interactionError',
										{ lng: interaction.locale }
									),
								})
								.setDescription(
									client.localization.t(
										'common:missingBotPermissions',
										{
											lng: interaction.locale,
											permissions: permsBot,
										}
									)
								)
								.setTimestamp(),
						],
						ephemeral: true,
					})
				}

				if (
					button.options &&
					button.options.user_permissions &&
					!member.permissions.has(button.options?.user_permissions)
				) {
					const permsUser = button.options?.user_permissions
						?.map((x) => x)
						.join(', ')

					return await interaction.reply({
						embeds: [
							new EmbedBuilder()
								.setColor(client.config.colors.error)
								.setAuthor({
									name: client.localization.t(
										'common:interactionError',
										{ lng: interaction.locale }
									),
								})
								.setDescription(
									client.localization.t(
										'common:missingUserPermissions',
										{
											lng: interaction.locale,
											permissions: permsUser,
										}
									)
								)
								.setTimestamp(),
						],
						ephemeral: true,
					})
				}

				const cooldownAmount = (button.options?.cooldown ?? 5) * 1000

				if (
					client.cooldowns.isOnCooldown(interaction.customId, user.id)
				) {
					const remainingTime =
						client.cooldowns.getRemainingCooldown(
							interaction.customId,
							user.id
						) + cooldownAmount

					if (now < remainingTime) {
						const expiredTimestamp = Math.round(
							remainingTime / 1000
						)

						if (interaction.deferred || interaction.replied) {
							return await interaction.followUp({
								embeds: [
									new EmbedBuilder()
										.setColor(client.config.colors.error)
										.setAuthor({
											name: client.localization.t(
												'common:interactionError',
												{ lng: interaction.locale }
											),
										})
										.setDescription(
											client.localization.t(
												'common:cooldown',
												{
													lng: interaction.locale,
													cooldown: expiredTimestamp,
												}
											)
										)
										.setTimestamp(),
								],
								ephemeral: true,
							})
						} else {
							return await interaction.reply({
								embeds: [
									new EmbedBuilder()
										.setColor(client.config.colors.error)
										.setAuthor({
											name: client.localization.t(
												'common:interactionError',
												{ lng: interaction.locale }
											),
										})
										.setDescription(
											client.localization.t(
												'common:cooldown',
												{
													lng: interaction.locale,
													cooldown: expiredTimestamp,
												}
											)
										)
										.setTimestamp(),
								],
								ephemeral: true,
							})
						}
					}
				}

				client.cooldowns.setCooldown(
					interaction.customId,
					user.id,
					cooldownAmount
				)

				return await (
					button as Component<ButtonInteraction<'cached'>>
				).execute(client, interaction as ButtonInteraction<'cached'>)
			}
		} catch (error) {
			if (error instanceof Error) {
				client.logger.error(error.stack as string)
				if (interaction.deferred || interaction.replied) {
					return await interaction.followUp({
						embeds: [
							new EmbedBuilder()
								.setColor(client.config.colors.error)
								.setAuthor({
									name: client.localization.t(
										'common:interactionError',
										{ lng: interaction.locale }
									),
								})
								.setDescription(
									client.localization.t('common:error', {
										lng: interaction.locale,
										errorMessage: error.message,
									})
								)
								.setTimestamp(),
						],
						ephemeral: true,
					})
				} else {
					await interaction.reply({
						embeds: [
							new EmbedBuilder()
								.setColor(client.config.colors.error)
								.setAuthor({
									name: client.localization.t(
										'common:interactionError',
										{ lng: interaction.locale }
									),
								})
								.setDescription(
									client.localization.t('common:error', {
										lng: interaction.locale,
										errorMessage: error.message,
									})
								)
								.setTimestamp(),
						],
						ephemeral: true,
					})
				}
			}
		}
	}
)
