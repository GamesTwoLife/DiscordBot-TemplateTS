import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ChatInputCommandInteraction,
	ComponentType,
	ContextMenuCommandInteraction,
	EmbedBuilder,
} from 'discord.js'
import { Client } from '../lib/Client'

export default async function Paggination(
	client: Client,
	interaction: ChatInputCommandInteraction | ContextMenuCommandInteraction,
	pages: EmbedBuilder[],
	time: number = 30 * 1000,
	emojis: string[] = ['⏪', '🏠', '⏩']
) {
	try {
		if (!interaction || !pages || pages.length === 0)
			throw new Error('Wrong arguments')
		if (emojis.length < 3 || emojis.length > 3)
			throw new Error(
				'Less than or more than 3 emojis in the array are specified'
			)

		await interaction.deferReply()

		if (pages.length === 1) {
			return await interaction.editReply({
				embeds: pages,
				components: [],
			})
		}

		const prev = new ButtonBuilder()
			.setCustomId('prev')
			.setStyle(ButtonStyle.Secondary)
			.setEmoji(emojis[0])
			.setDisabled(true)

		const home = new ButtonBuilder()
			.setCustomId('home')
			.setStyle(ButtonStyle.Secondary)
			.setEmoji(emojis[1])
			.setDisabled(true)

		const next = new ButtonBuilder()
			.setCustomId('next')
			.setStyle(ButtonStyle.Secondary)
			.setEmoji(emojis[2])

		const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents([
			prev,
			home,
			next,
		])
		let index = 0

		const msg = await interaction.editReply({
			embeds: [
				pages[index].setFooter({
					text: client.localization.t(
						'commands:samples.sample.pagination.footer',
						{
							lng: interaction.locale,
							currentPage: index + 1,
							totalPages: pages.length,
						}
					),
				}),
			],
			components: [buttons],
		})

		await client.db.interactions.createInteraction({
			guildID: interaction.guild!.id,
			interactionMessageId: msg.id,
			expiresAt: new Date(Date.now() + time),
		})

		const collector = msg.createMessageComponentCollector({
			componentType: ComponentType.Button,
			time,
		})

		collector.on('collect', async (i) => {
			if (i.user.id !== interaction.user.id) return i.deferUpdate()

			await i.deferUpdate()

			if (i.customId === 'prev' && index > 0) {
				index--
			} else if (i.customId === 'home') {
				index = 0
			} else if (i.customId === 'next' && index < pages.length - 1) {
				index++
			}

			if (index === 0) {
				prev.setDisabled(true)
				home.setDisabled(true)
			} else {
				prev.setDisabled(false)
				home.setDisabled(false)
			}

			if (index === pages.length - 1) {
				next.setDisabled(true)
			} else {
				next.setDisabled(false)
			}

			collector.resetTimer()

			await client.db.interactions.updateInteraction(
				interaction.guild!.id,
				msg.id,
				{
					expiresAt: new Date(Date.now() + time),
				}
			)

			await msg.edit({
				embeds: [
					pages[index].setFooter({
						text: client.localization.t(
							'commands:samples.sample.pagination.footer',
							{
								lng: interaction.locale,
								currentPage: index + 1,
								totalPages: pages.length,
							}
						),
					}),
				],
				components: [buttons],
			})
		})

		return msg
	} catch (error: any) {
		client.logger.error(error)

		if (interaction.deferred || interaction.replied) {
			return await interaction.followUp({
				content: `${error.message}`,
				ephemeral: true,
			})
		} else {
			return await interaction.reply({
				content: `${error.message}`,
				ephemeral: true,
			})
		}
	}
}
