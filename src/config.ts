import {
	ActivityType,
	GatewayIntentBits,
	MessageMentionOptions,
	Partials,
	PresenceData,
	WebSocketOptions,
} from 'discord.js'
import { version } from '../package.json'

const intents: GatewayIntentBits[] | number = [3247863 | (1 << 24) | (1 << 25)] // All Intents
const partials: Array<Partials> = [
	Partials.Channel,
	Partials.GuildMember,
	Partials.Message,
	Partials.User,
	Partials.ThreadMember,
	Partials.GuildScheduledEvent,
]
const allowedMentions: MessageMentionOptions = {
	parse: ['roles', 'users', 'everyone'],
	repliedUser: true,
}
const presence: PresenceData = {
	status: 'idle',
	activities: [
		{
			name: `v${version}`,
			state: 'by gamestwolife',
			type: ActivityType.Custom,
		},
	],
}
const ws: WebSocketOptions = { large_threshold: 250 }

export const config = {
	token: 'your-token-here',
	mongoURL:
		'mongodb+srv://[username]:<password>@[uri]/<db_name>?retryWrites=true&w=majority',
	clientId: 'client-id-here',
	publicKey: 'client-public-key-here',
	guildId: 'guild-id-here',
	developers: ['ID Developer'],
	colors: {
		info: 0x5bc0de,
		success: 0xf0ad4e,
		warn: 0x22bb33,
		error: 0xbb2124,
	},

	intents: intents,
	partials: partials,
	allowedMentions: allowedMentions,
	presence: presence,
	ws: ws,
}
