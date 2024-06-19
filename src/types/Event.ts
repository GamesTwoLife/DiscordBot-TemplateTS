import { Awaitable, InteractionResponse, Message } from 'discord.js'
import { Client } from '../lib/Client'

export type EventExecute = (
	client: Client,
	...args: any[]
) => Awaitable<void | InteractionResponse<boolean> | Message<boolean>>
