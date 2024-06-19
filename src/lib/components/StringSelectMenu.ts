import { StringSelectMenuInteraction } from 'discord.js'
import Component from '../Component'

import { ComponentExecute, ComponentOptions } from '../../types/Component'

export default class StringSelectMenu extends Component<
	StringSelectMenuInteraction<'cached'>
> {
	constructor(
		customId: string,
		execute: ComponentExecute<StringSelectMenuInteraction<'cached'>>,
		options?: ComponentOptions
	) {
		super({ customId, type: 'selectmenu' }, execute, options)
	}
}
