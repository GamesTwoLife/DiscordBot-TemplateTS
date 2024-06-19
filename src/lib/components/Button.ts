import { ButtonInteraction } from 'discord.js'
import Component from '../Component'

import { ComponentExecute, ComponentOptions } from '../../types/Component'

export default class Button extends Component<ButtonInteraction<'cached'>> {
	constructor(
		customId: string,
		execute: ComponentExecute<ButtonInteraction<'cached'>>,
		options?: ComponentOptions
	) {
		super({ customId, type: 'button' }, execute, options)
	}
}
