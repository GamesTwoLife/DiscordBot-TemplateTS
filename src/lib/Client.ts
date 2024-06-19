import * as Discord from 'discord.js'
import { config } from '../config'
import Logger from '../utils/Logger'
import EventHandler from '../helpers/EventHandler'
import CommandHandler from '../helpers/CommandHandler'
import ComponentHandler from '../helpers/ComponentHandler'
import SlashUpdater from '../helpers/SlashUpdater'
import Database from './Database'
import Cooldown from '../utils/Cooldown'
import Localization from '../utils/Localization'

export class Client extends Discord.Client {
	public readonly config = config

	public logger: Logger = new Logger()

	public events: EventHandler = new EventHandler(this)
	public commands: CommandHandler = new CommandHandler(this)
	public components: ComponentHandler = new ComponentHandler(this)
	private slashUpdater: SlashUpdater = new SlashUpdater(this)

	public cooldowns: Cooldown = new Cooldown()

	public localization: Localization = new Localization()
	public db: Database = new Database(this, this.config.mongoURL)

	constructor() {
		super({
			allowedMentions: config.allowedMentions,
			intents: config.intents,
			partials: config.partials,
			ws: config.ws,
			presence: config.presence,
		})
	}

	async connect() {
		;(async () => {
			await this.localization.initialize()
			await this.events.load()
			await this.commands.load()
			await this.components.load()

			await this.slashUpdater.load()

			await this.db
				.connect()
				.then(async () => {
					await this.login(config.token) // We authorize the client only if the connection to the database is successful
				})
				.catch((err) => this.logger.error(err))
		})()
	}
}
