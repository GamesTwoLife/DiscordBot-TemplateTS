import { Collection } from 'discord.js'

type CooldownKey = string
type UserID = string

export default class Cooldown {
	private cooldowns: Collection<CooldownKey, Collection<UserID, number>>

	constructor() {
		this.cooldowns = new Collection<
			CooldownKey,
			Collection<UserID, number>
		>()
	}

	setCooldown(
		name: CooldownKey,
		userID: UserID,
		cooldownAmount: number
	): void {
		if (!this.cooldowns.has(name)) {
			this.cooldowns.set(name, new Collection<UserID, number>())
		}

		const timestamps = this.cooldowns.get(name)
		const now = Date.now()
		timestamps!.set(userID, now)

		setTimeout(() => timestamps!.delete(userID), cooldownAmount)
	}

	getRemainingCooldown(name: CooldownKey, userID: UserID): number {
		const timestamps = this.cooldowns.get(name)
		if (!timestamps || !timestamps.has(userID)) return 0

		const now = Date.now()
		const expirationTime =
			timestamps.get(userID)! + (timestamps.get(userID) ?? 0)

		const remaining = expirationTime - now
		return remaining > 0 ? remaining : 0
	}

	isOnCooldown(name: CooldownKey, userID: UserID): boolean {
		return this.getRemainingCooldown(name, userID) > 0
	}
}
