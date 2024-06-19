import { Client } from './Client'
import mongoose, { Connection, ConnectOptions } from 'mongoose'

import UsersDB from './../schemas/users'
import InteractionsDB from './../schemas/interations'

export default class Database {
	private connection: Connection | null = null

	public users: typeof UsersDB
	public interactions: typeof InteractionsDB

	constructor(
		private client: Client,
		private uri: string,
		private options: ConnectOptions = {}
	) {
		this.users = UsersDB
		this.interactions = InteractionsDB
	}

	async connect(): Promise<void> {
		try {
			mongoose.Promise = Promise
			await mongoose
				.connect(this.uri, {
					...this.options,
				})
				.then((connection) => {
					this.connection = connection.connection
					this.client.logger.log('Connected to database')
				})
		} catch (error) {
			throw this.client.logger.error(error as Error)
		}
	}

	async disconnect(): Promise<void> {
		if (this.connection) {
			await this.connection.close()
			this.client.logger.log('Disconnected from database')
		}
	}
}
