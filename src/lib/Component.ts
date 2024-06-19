import {
	ComponentExecute,
	ComponentOptions,
	InteractionType,
} from '../types/Component'

type TypeComponent = 'autocomplete' | 'button' | 'selectmenu' | 'modalSubmit'

export type ComponentType<T extends TypeComponent> = T

type AutocompleteComponentData = {
	name: string
	type: ComponentType<'autocomplete'>
}
type ButtonComponentData = { customId: string; type: ComponentType<'button'> }
type SelectMenuComponentData = {
	customId: string
	type: ComponentType<'selectmenu'>
}
type ModalComponentData = {
	customId: string
	type: ComponentType<'modalSubmit'>
}

export type ComponentData =
	| ButtonComponentData
	| SelectMenuComponentData
	| ModalComponentData
	| AutocompleteComponentData

export default class Component<T extends InteractionType> {
	public data: ComponentData
	public execute: ComponentExecute<T>
	public options?: ComponentOptions

	constructor(
		data: ComponentData,
		execute: ComponentExecute<T>,
		options?: ComponentOptions
	) {
		this.data = data
		this.execute = execute
		this.options = options
	}
}
