import { RateLimitData } from 'discord.js'
import { Client } from '../../lib/Client'
import Event from '../../lib/Event'

export default new Event(
	{
		name: 'rateLimited',
	},
	async (client: Client, rateLimitInfo: RateLimitData) => {
		client.logger.info(`
Global: ${rateLimitInfo.global}
Hash: ${rateLimitInfo.hash}
Limit: ${rateLimitInfo.limit}
MajorParameter: ${rateLimitInfo.majorParameter}
Method: ${rateLimitInfo.method}
Route: ${rateLimitInfo.route}
TimeToReset: ${rateLimitInfo.timeToReset}
URL: ${rateLimitInfo.url}
		`)
	}
)
