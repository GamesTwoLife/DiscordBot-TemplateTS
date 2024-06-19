import {
	ApplicationCommandDataResolvable,
	ApplicationCommandType,
	ApplicationCommandOptionData,
} from 'discord.js'
import {
	CommandExecute,
	CommandOptions,
	InteractionType,
} from '../types/Command'

type ChatInputCommandData = ApplicationCommandDataResolvable & {
	type: ApplicationCommandType.ChatInput
	name: string
	description: string
	options?: readonly ApplicationCommandOptionData[]
}

type MessageCommandData = ApplicationCommandDataResolvable & {
	type: ApplicationCommandType.Message
	name: string
}

type UserCommandData = ApplicationCommandDataResolvable & {
	type: ApplicationCommandType.User
	name: string
}

type ContextMenuCommandData = MessageCommandData | UserCommandData

export type CommandData = ChatInputCommandData | ContextMenuCommandData

export default class Command<T extends InteractionType> {
	public data: CommandData
	public execute: CommandExecute<T>
	public options?: CommandOptions

	constructor(
		data: CommandData,
		execute: CommandExecute<T>,
		options?: CommandOptions
	) {
		this.data = data
		this.execute = execute
		this.options = options

		if (
			this.data.type === ApplicationCommandType.ChatInput &&
			!this.data.description
		) {
			throw new Error('A description is required for the ChatInput type')
		}
	}
}
