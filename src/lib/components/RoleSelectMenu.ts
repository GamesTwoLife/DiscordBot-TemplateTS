import { RoleSelectMenuInteraction } from 'discord.js'
import Component from '../Component'

import { ComponentExecute, ComponentOptions } from '../../types/Component'

export default class RoleSelectMenu extends Component<
	RoleSelectMenuInteraction<'cached'>
> {
	constructor(
		customId: string,
		execute: ComponentExecute<RoleSelectMenuInteraction<'cached'>>,
		options?: ComponentOptions
	) {
		super({ customId, type: 'selectmenu' }, execute, options)
	}
}
