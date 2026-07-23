import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import csCommon from './cs/common.json'
import csFields from './cs/fields.json'
import enCommon from './en/common.json'
import enFields from './en/fields.json'

export const LANG_STORAGE_KEY = 'eltif-lang'

function resolveInitialLanguage(): 'cs' | 'en' {
  if (typeof window === 'undefined') return 'cs'
  const stored = window.localStorage.getItem(LANG_STORAGE_KEY)
  if (stored === 'cs' || stored === 'en') return stored
  return 'cs'
}

void i18n.use(initReactI18next).init({
  resources: {
    cs: { common: csCommon, fields: csFields },
    en: { common: enCommon, fields: enFields },
  },
  lng: resolveInitialLanguage(),
  fallbackLng: 'cs',
  defaultNS: 'common',
  ns: ['common', 'fields'],
  interpolation: { escapeValue: false },
})

export function setAppLanguage(lng: 'cs' | 'en') {
  void i18n.changeLanguage(lng)
  window.localStorage.setItem(LANG_STORAGE_KEY, lng)
  document.documentElement.lang = lng
}

document.documentElement.lang = resolveInitialLanguage()

export default i18n
