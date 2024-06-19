import { MentionableSelectMenuInteraction } from 'discord.js'
import Component from '../Component'

import { ComponentExecute, ComponentOptions } from '../../types/Component'

export default class MentionableSelectMenu extends Component<
	MentionableSelectMenuInteraction<'cached'>
> {
	constructor(
		customId: string,
		execute: ComponentExecute<MentionableSelectMenuInteraction<'cached'>>,
		options?: ComponentOptions
	) {
		super({ customId, type: 'selectmenu' }, execute, options)
	}
}
