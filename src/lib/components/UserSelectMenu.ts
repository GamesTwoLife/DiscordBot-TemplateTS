import { UserSelectMenuInteraction } from 'discord.js'
import Component from '../Component'

import { ComponentExecute, ComponentOptions } from '../../types/Component'

export default class UserSelectMenu extends Component<
	UserSelectMenuInteraction<'cached'>
> {
	constructor(
		customId: string,
		execute: ComponentExecute<UserSelectMenuInteraction<'cached'>>,
		options?: ComponentOptions
	) {
		super({ customId, type: 'selectmenu' }, execute, options)
	}
}
