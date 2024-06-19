import { Client } from '../../lib/Client'
import Event from '../../lib/Event'

export default new Event(
	{
		name: 'warn',
	},
	async (client: Client, message: string) => {
		client.logger.warn(message)
	}
)
