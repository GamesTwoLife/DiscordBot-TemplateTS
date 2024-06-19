import Component from '../Component'

import { ComponentExecute } from '../../types/Component'
import { AutocompleteInteraction } from 'discord.js'

type AutocompleteOptions = {
	ownerOnly?: boolean
	devGuildOnly?: boolean
}

export default class Autocomplete extends Component<
	AutocompleteInteraction<'cached'>
> {
	constructor(
		name: string,
		execute: ComponentExecute<AutocompleteInteraction<'cached'>>,
		options?: AutocompleteOptions
	) {
		super({ name, type: 'autocomplete' }, execute, options)
	}
}
