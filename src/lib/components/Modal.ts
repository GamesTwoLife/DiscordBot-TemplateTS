import { ModalSubmitInteraction } from 'discord.js'
import Component from '../Component'

import { ComponentExecute, ComponentOptions } from '../../types/Component'

export default class Modal extends Component<ModalSubmitInteraction<'cached'>> {
	constructor(
		customId: string,
		execute: ComponentExecute<ModalSubmitInteraction<'cached'>>,
		options?: ComponentOptions
	) {
		super({ customId, type: 'modalSubmit' }, execute, options)
	}
}
