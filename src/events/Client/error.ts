import { Client } from '../../lib/Client'
import Event from '../../lib/Event'

export default new Event(
	{
		name: 'error',
	},
	async (client: Client, error: Error) => {
		client.logger.error(`ClientError: ${error.message}`)
	}
)
