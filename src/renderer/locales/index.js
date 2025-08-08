// src/renderer/locales/index.js

import { createI18n } from 'vue-i18n'
import pluralRules from './rules/pluralization'
import datetimeFormats from './rules/datetime'

function loadLocaleMessages() {
  const locales = import.meta.glob('./translations/*/*.json', { eager: true, import: 'default' })
  const messages = {}

  for (const path in locales) {
    const [ , locale, filename ] = path.match(/\.\/translations\/([^/]+)\/(.+)\.json$/)
    messages[locale] ??= {}
    Object.assign(messages[locale], locales[path])
  }

  return messages
}

const messages = loadLocaleMessages()

const i18n = createI18n({
  legacy: false,
  locale: 'ru',
  fallbackLocale: 'ru',
  globalInjection: true,
  messages,
  pluralRules,
  datetimeFormats
})

export default i18n
