import i18n_config from '@/locales/i18n_config'

export const colorizePayingStatus = (val: string | number) => {
  const value = Number(val)
  const color = {
    1: '#666666',
    2: '#C2185B',
    3: '#689F38',
    4: '#1565C0'
  }
  return color[value as 1 | 2 | 3 | 4]
}

const { locale, messages } = i18n_config.global

export const colorizeApproveStatus = (val: string) => {
  const statuses = {
    pending: { color: '#1565C0', name: messages[locale].pending },
    accepted: { color: '#689F38', name: messages[locale].approved },
    none: { color: '#666666', name: messages[locale]['no match'] },
    rejected: { color: '#F57C00', name: messages[locale].rejected }
  }
  return statuses[val as 'pending' | 'accepted' | 'none' | 'rejected']
}

export const colorizeProductStatus = (val: string | number) => {
  const statuses = {
    '1': { color: '#666666', name: messages[locale].new },
    '2': { color: '#1565C0', name: messages[locale]['in purchase'] },
    '3': { color: '#689F38', name: messages[locale].received },
    '4': { color: '#C2185B', name: messages[locale]['on approve'] },
    '7': { color: '#C62828', name: messages[locale].canceled_2 },
    '8': { color: '#F57C00', name: messages[locale].deleted_2 }
  }
  return statuses[val as '1' | '2' | '3' | '4' | '7' | '8']
}
