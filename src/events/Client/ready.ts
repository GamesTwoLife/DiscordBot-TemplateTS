import { Client } from '../../lib/Client'
import Event from '../../lib/Event'

export default new Event(
	{
		name: 'ready',
		once: true,
	},
	async (client: Client) => {
		client.logger.info(`Ready! Logged in ${client.user!.username}`)
	}
)
