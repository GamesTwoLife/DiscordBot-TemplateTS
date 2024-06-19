import { ActionRowBuilder, ButtonBuilder } from 'discord.js'

export default function ButtonWrapper(
	buttons: ButtonBuilder[]
): ActionRowBuilder<ButtonBuilder>[] {
	const components = []
	let row = new ActionRowBuilder<ButtonBuilder>()

	for (let a = 0; a < buttons.length && a < 25; ++a) {
		if (a % 5 === 0 && a > 0) {
			components.push(row)
			row = new ActionRowBuilder<ButtonBuilder>()
		}

		row.addComponents(buttons[a])
	}

	if (row.components.length > 0) {
		components.push(row)
	}

	return components
}
