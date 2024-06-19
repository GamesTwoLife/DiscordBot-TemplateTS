import {
	EmbedBuilder,
	GuildMember,
	Guild,
	Interaction,
	ModalSubmitInteraction,
	User,
} from 'discord.js'
import { Client } from '../../lib/Client'
import Event from '../../lib/Event'
import Component from '../../lib/Component'

export default new Event(
	{
		name: 'interactionCreate',
	},
	async (client: Client, interaction: Interaction) => {
		if (!interaction.isModalSubmit()) return

		try {
			const user = interaction.user as User
			const member = interaction.member as GuildMember
			const guild = interaction.guild as Guild

			const now = Date.now()

			const modals = client.components.cache
				.get(interaction.customId)
				?.filter((component) => component.data.type === 'modalSubmit')

			if (!modals || modals.length === 0) {
				const savedInteraction =
					await client.db.interactions.getInteraction(
						guild.id,
						interaction.id
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

			for (const modal of modals) {
				if (
					modal.options &&
					modal.options.ownerOnly &&
					!client.config.developers.includes(user.id)
				) {
					return await interaction.reply({
						embeds: [
							new EmbedBuilder()
								.setColor(0xff0000)
								.setAuthor({
									name: `${client.localization.t(
										'common:interactionError',
										{ lng: interaction.locale }
									)}`,
								})
								.setDescription(
									client.localization.t(
										'common:modalOnlyDeveloper',
										{ lng: interaction.locale }
									)
								)
								.setTimestamp(),
						],
						ephemeral: true,
					})
				}

				if (
					modal.options &&
					modal.options.devGuildOnly &&
					client.config.guildId !== guild.id
				) {
					return await interaction.reply({
						embeds: [
							new EmbedBuilder()
								.setColor(0xff0000)
								.setAuthor({
									name: `${client.localization.t(
										'common:interactionError',
										{ lng: interaction.locale }
									)}`,
								})
								.setDescription(
									client.localization.t(
										'common:modalOnlyDevGuild',
										{ lng: interaction.locale }
									)
								)
								.setTimestamp(),
						],
						ephemeral: true,
					})
				}

				if (
					modal.options &&
					modal.options.bot_permissions &&
					!guild.members.me!.permissions.has(
						modal.options?.bot_permissions
					)
				) {
					const permsBot = modal.options?.bot_permissions
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
					modal.options &&
					modal.options.user_permissions &&
					!member.permissions.has(modal.options?.user_permissions)
				) {
					const permsUser = modal.options?.user_permissions
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

				const cooldownAmount = (modal.options?.cooldown ?? 5) * 1000

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
					modal as Component<ModalSubmitInteraction<'cached'>>
				).execute(
					client,
					interaction as ModalSubmitInteraction<'cached'>
				)
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
