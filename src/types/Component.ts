import {
	ButtonInteraction,
	AnySelectMenuInteraction,
	ModalSubmitInteraction,
	AutocompleteInteraction,
	PermissionResolvable,
	Awaitable,
	InteractionResponse,
	Message,
} from 'discord.js'
import { Client } from '../lib/Client'

export type InteractionType =
	| ButtonInteraction<'cached'>
	| AnySelectMenuInteraction<'cached'>
	| ModalSubmitInteraction<'cached'>
	| AutocompleteInteraction<'cached'>

export type ComponentExecute<T extends InteractionType> = (
	client: Client,
	interaction: T
) => Awaitable<void | InteractionResponse<boolean> | Message<boolean>>

export type ComponentOptions = {
	cooldown?: number
	ownerOnly?: boolean
	devGuildOnly?: boolean
	bot_permissions?: PermissionResolvable[]
	user_permissions?: PermissionResolvable[]
}
