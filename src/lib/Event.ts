import {
	Client as DiscordClient,
	ClientEvents,
	RestEvents,
	Awaitable,
	InteractionResponse,
	Message,
} from 'discord.js'
import { Client } from './Client'

type Events = ClientEvents & RestEvents
type EventArguments<T extends keyof Events> = Events[T]

type EventData<T extends keyof Events> = {
	name: T
	once?: boolean
}

type EventExecute<T extends keyof Events> = (
	client: Client & DiscordClient,
	...args: EventArguments<T>
) => Awaitable<void | InteractionResponse<boolean> | Message<boolean>>

export default class Event<T extends keyof Events> {
	public data: EventData<T>
	public execute: EventExecute<T>

	constructor(data: EventData<T>, execute: EventExecute<T>) {
		this.data = data
		this.execute = execute
	}
}
