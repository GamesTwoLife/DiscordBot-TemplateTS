import { ChannelSelectMenuInteraction } from 'discord.js'
import Component from '../Component'

import { ComponentExecute, ComponentOptions } from '../../types/Component'

export default class ChannelSelectMenu extends Component<
	ChannelSelectMenuInteraction<'cached'>
> {
	constructor(
		customId: string,
		execute: ComponentExecute<ChannelSelectMenuInteraction<'cached'>>,
		options?: ComponentOptions
	) {
		super({ customId, type: 'selectmenu' }, execute, options)
	}
}
