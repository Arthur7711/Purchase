import i18n_config from '@/locales/i18n_config'
const { messages, locale } = i18n_config.global

export const analytTypes = [
  {
    id: 1,
    title: 'purposes',
    name: messages[locale]['analysis'] + ' ' + messages[locale]['objectives']
  },
  {
    id: 2,
    title: 'types',
    name: messages[locale]['analysis'] + ' ' + messages[locale]['types']
  },
  {
    id: 3,
    title: 'subtypes',
    name: messages[locale]['analysis'] + ' ' + messages[locale]['subtypes']
  }
]
