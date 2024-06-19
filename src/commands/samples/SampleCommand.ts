import {
	ActionRowBuilder,
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ButtonBuilder,
	ButtonStyle,
	ChannelSelectMenuBuilder,
	ChatInputCommandInteraction,
	EmbedBuilder,
	MentionableSelectMenuBuilder,
	ModalBuilder,
	RoleSelectMenuBuilder,
	StringSelectMenuBuilder,
	TextInputBuilder,
	TextInputStyle,
	UserSelectMenuBuilder,
	version,
} from 'discord.js'
import Command from '../../lib/Command'
import { Client } from '../../lib/Client'
import Paggination from '../../utils/Paggination'
import ButtonWrapper from '../../utils/ButtonWrapper'
import { t } from 'i18next'

import ts from 'typescript'

export default new Command(
	{
		name: t('commands:samples.sample.name', { lng: 'en' }).slice(0, 32),
		nameLocalizations: {
			uk: t('commands:samples.sample.name', { lng: 'uk' }).slice(0, 32),
		},
		description: t('commands:samples.sample.description', { lng: 'en' }),
		descriptionLocalizations: {
			uk: t('commands:samples.sample.description', { lng: 'uk' }),
		},
		type: ApplicationCommandType.ChatInput,
		options: [
			{
				name: 'autocomplete',
				description: t(
					'commands:samples.sample.autocomplete.description',
					{ lng: 'en' }
				),
				descriptionLocalizations: {
					uk: t('commands:samples.sample.autocomplete.description', {
						lng: 'uk',
					}),
				},
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'input',
						description: t(
							'commands:samples.sample.autocomplete.options.input.description',
							{ lng: 'en' }
						),
						descriptionLocalizations: {
							uk: t(
								'commands:samples.sample.autocomplete.options.input.description',
								{ lng: 'uk' }
							),
						},
						type: ApplicationCommandOptionType.String,
						autocomplete: true,
						required: true,
					},
				],
			},
			{
				name: 'button',
				description: t('commands:samples.sample.button.description', {
					lng: 'en',
				}),
				descriptionLocalizations: {
					uk: t('commands:samples.sample.button.description', {
						lng: 'uk',
					}),
				},
				type: ApplicationCommandOptionType.Subcommand,
			},
			{
				name: 'menu',
				description: t('commands:samples.sample.menu.description', {
					lng: 'en',
				}),
				descriptionLocalizations: {
					uk: t('commands:samples.sample.menu.description', {
						lng: 'uk',
					}),
				},
				type: ApplicationCommandOptionType.Subcommand,
			},
			{
				name: 'modal',
				description: t('commands:samples.sample.modal.description', {
					lng: 'en',
				}),
				descriptionLocalizations: {
					uk: t('commands:samples.sample.modal.description', {
						lng: 'uk',
					}),
				},
				type: ApplicationCommandOptionType.Subcommand,
			},
			{
				name: 'paggination',
				description: t(
					'commands:samples.sample.paggination.description',
					{ lng: 'en' }
				),
				descriptionLocalizations: {
					uk: t('commands:samples.sample.paggination.description', {
						lng: 'uk',
					}),
				},
				type: ApplicationCommandOptionType.Subcommand,
			},
			{
				name: 'buttonwrapper',
				description: t(
					'commands:samples.sample.buttonwrapper.description',
					{ lng: 'en' }
				),
				descriptionLocalizations: {
					uk: t('commands:samples.sample.buttonwrapper.description', {
						lng: 'uk',
					}),
				},
				type: ApplicationCommandOptionType.Subcommand,
			},
			{
				name: 'info',
				description: t('commands:samples.sample.info.description', {
					lng: 'en',
				}),
				descriptionLocalizations: {
					uk: t('commands:samples.sample.info.description', {
						lng: 'uk',
					}),
				},
				type: ApplicationCommandOptionType.Subcommand,
			},
		],
		dmPermission: true,
	},
	async (
		client: Client,
		interaction: ChatInputCommandInteraction<'cached'>
	) => {
		const { options } = interaction

		switch (options.getSubcommand()) {
			case 'autocomplete':
				{
					const Input = options.getString('input', true)

					await interaction.reply({ content: `${Input}` })
				}
				break

			case 'button':
				{
					const row =
						new ActionRowBuilder<ButtonBuilder>().addComponents(
							new ButtonBuilder()
								.setCustomId('sample')
								.setStyle(ButtonStyle.Secondary)
								.setLabel('Click me!')
						)

					await interaction.reply({ components: [row] })
				}
				break

			case 'menu':
				{
					const row =
						new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
							new StringSelectMenuBuilder()
								.setCustomId('string_sample')
								.setOptions(
									{
										label: 'Sample Option 1',
										value: 'sample_option_1',
									},
									{
										label: 'Sample Option 2',
										value: 'sample_option_2',
									}
								)
						)

					const row2 =
						new ActionRowBuilder<UserSelectMenuBuilder>().addComponents(
							new UserSelectMenuBuilder().setCustomId(
								'user_sample'
							)
						)

					const row3 =
						new ActionRowBuilder<MentionableSelectMenuBuilder>().addComponents(
							new MentionableSelectMenuBuilder().setCustomId(
								'mentionable_sample'
							)
						)

					const row4 =
						new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
							new ChannelSelectMenuBuilder().setCustomId(
								'channel_sample'
							)
						)

					const row5 =
						new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(
							new RoleSelectMenuBuilder().setCustomId(
								'role_sample'
							)
						)

					await interaction.reply({
						components: [row, row2, row3, row4, row5],
					})
				}
				break

			case 'modal':
				{
					const modal = new ModalBuilder()
						.setCustomId('sample')
						.setTitle('Sample Modal')

					const input = new TextInputBuilder()
						.setCustomId('input')
						.setStyle(TextInputStyle.Short)
						.setLabel('Input Text')
						.setRequired(true)

					const row =
						new ActionRowBuilder<TextInputBuilder>().addComponents([
							input,
						])

					modal.setComponents(row)

					await interaction.showModal(modal)
				}
				break

			case 'paggination':
				{
					let embeds = []

					for (let i = 0; i < 5; i++) {
						embeds.push(
							new EmbedBuilder()
								.setColor(client.config.colors.info)
								.setDescription(
									client.localization.t(
										`commands:samples.sample.pagination.pageStrings.${[
											i,
										]}`,
										{ lng: interaction.locale }
									)
								)
						)
					}

					await Paggination(client, interaction, embeds)
				}
				break

			case 'buttonwrapper':
				{
					const buttons = [
						new ButtonBuilder()
							.setCustomId('say_hello')
							.setStyle(ButtonStyle.Secondary)
							.setLabel(
								client.localization.t(
									'commands:samples.sample.buttonwrapper.say_hello',
									{ lng: interaction.locale }
								)
							),
						new ButtonBuilder()
							.setLabel(
								client.localization.t(
									'commands:samples.sample.buttonwrapper.cool_template',
									{ lng: interaction.locale }
								)
							)
							.setStyle(ButtonStyle.Link)
							.setURL(
								'https://github.com/GamesTwoLife/DiscordBot-TemplateTS'
							),
					]

					await interaction.reply({
						content: client.localization.t(
							'commands:samples.sample.buttonwrapper.content',
							{ lng: interaction.locale }
						),
						components: ButtonWrapper(buttons),
					})
				}
				break

			case 'info':
				{
					await interaction.reply({
						embeds: [
							new EmbedBuilder()
								.setColor(client.config.colors.info)
								.addFields(
									{
										name: 'Node.js',
										value: `${process.version}`,
									},
									{
										name: 'Typescript',
										value: `${ts.version}`,
									},
									{
										name: 'Discord.js',
										value: `${version}`,
									}
								),
						],
					})
				}
				break
		}
	},
	{
		cooldown: 0,
		ownerOnly: false,
		devGuildOnly: true,
		bot_permissions: ['ViewChannel', 'SendMessages'],
	}
)
