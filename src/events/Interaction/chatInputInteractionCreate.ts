import {
	Guild,
	Interaction,
	User,
	GuildMember,
	ChatInputCommandInteraction,
	EmbedBuilder,
} from 'discord.js'
import { Client } from '../../lib/Client'
import Event from '../../lib/Event'

export default new Event(
	{
		name: 'interactionCreate',
	},
	async (client: Client, interaction: Interaction) => {
		if (!interaction.isChatInputCommand()) return

		try {
			const user = interaction.user as User
			const member = interaction.member as GuildMember
			const guild = interaction.guild as Guild

			const now = Date.now()

			const command = client.commands.cache.get(interaction.commandName)

			if (!command) {
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
									'common:commandNoLongerExists',
									{ lng: interaction.locale }
								)
							)
							.setTimestamp(),
					],
					ephemeral: true,
				})
			}

			if (
				command.options &&
				command.options.ownerOnly &&
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
									'common:commandOnlyDeveloper',
									{ lng: interaction.locale }
								)
							)
							.setTimestamp(),
					],
					ephemeral: true,
				})
			}

			if (
				command.options &&
				command.options.devGuildOnly &&
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
									'common:commandOnlyDevGuild',
									{ lng: interaction.locale }
								)
							)
							.setTimestamp(),
					],
					ephemeral: true,
				})
			}

			if (
				command.options &&
				command.options.bot_permissions &&
				!guild.members.me!.permissions.has(
					command.options?.bot_permissions
				)
			) {
				const permsBot = command.options?.bot_permissions
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
				command.options &&
				command.options.user_permissions &&
				!member.permissions.has(command.options?.user_permissions)
			) {
				const permsUser = command.options?.user_permissions
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

			const cooldownAmount = (command.options?.cooldown ?? 5) * 1000

			const subCommandNames = interaction.options?.data
				?.filter((sub) => sub.type === 1)
				.map((sub) => sub.name)
			const commandName =
				subCommandNames.length > 0
					? `${interaction.commandName} ${subCommandNames[0]}`
					: interaction.commandName

			if (client.cooldowns.isOnCooldown(commandName, user.id)) {
				const remainingTime =
					client.cooldowns.getRemainingCooldown(
						interaction.commandName,
						user.id
					) + cooldownAmount

				if (now < remainingTime) {
					const expiredTimestamp = Math.round(remainingTime / 1000)

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

			client.cooldowns.setCooldown(commandName, user.id, cooldownAmount)

			return await command.execute(
				client,
				interaction as ChatInputCommandInteraction<'cached'>
			)
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
