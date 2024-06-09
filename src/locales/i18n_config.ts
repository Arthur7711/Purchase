import { createI18n } from 'vue-i18n'
import en from '@/locales/en/en.json'
import ru from '@/locales/ru/ru.json'

const locale = { en: en, ru: ru }


export default createI18n({
  locale: localStorage.getItem('lang') ? (localStorage.getItem('lang') as 'ru' | 'en') : 'en',
  fallbackLocale: 'en',
  messages: locale
})
