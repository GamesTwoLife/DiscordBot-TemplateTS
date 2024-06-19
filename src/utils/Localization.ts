import i18next, { TOptionsBase } from 'i18next'
import { $Dictionary, $SpecialObject } from 'i18next/typescript/helpers'

import resources from './../locales/resources'

export default class Localization {
	private i18n: typeof i18next

	constructor() {
		this.i18n = i18next
	}

	public async initialize(): Promise<void> {
		await this.i18n.init({
			lng: 'en', // Default language
			fallbackLng: 'en', // Default language in case of no translation
			defaultNS: 'common',
			interpolation: {
				escapeValue: false,
			},
			resources: {
				en: resources.en,
				uk: resources.uk,
			},
		})
	}

	public t(
		key: string | TemplateStringsArray | (string | TemplateStringsArray)[],
		options?: (TOptionsBase & $Dictionary) | undefined
	): string {
		return this.i18n.t(key, options)
	}
}

