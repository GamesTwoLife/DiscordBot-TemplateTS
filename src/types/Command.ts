import {
	Awaitable,
	ChatInputCommandInteraction,
	InteractionResponse,
	Message,
	MessageContextMenuCommandInteraction,
	PermissionResolvable,
	UserContextMenuCommandInteraction,
} from 'discord.js'
import { Client } from '../lib/Client'

export type InteractionType =
	| ChatInputCommandInteraction<'cached'>
	| UserContextMenuCommandInteraction<'cached'>
	| MessageContextMenuCommandInteraction<'cached'>

export type CommandExecute<T extends InteractionType> = (
	client: Client,
	interaction: T
) => Awaitable<void | InteractionResponse<boolean> | Message<boolean>>

export type CommandOptions = {
	premium?: boolean
	cooldown?: number
	ownerOnly?: boolean
	devGuildOnly?: boolean
	bot_permissions?: PermissionResolvable[]
	user_permissions?: PermissionResolvable[]
}
