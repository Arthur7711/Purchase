import i18n_config from '@/locales/i18n_config';

const { messages, locale } = i18n_config.global;

export const statuses = [
  { id: 0, title: messages[locale]['paid and scheduled'] },
  { id: 1, title: messages[locale]['paid'] }
];

export const currencyInfo = [
  // { id: 0, title: 'Армянский драм ֏' },
  { id: 0, title: 'Российский рубль ₽' },
  { id: 1, title: 'Доллар США $' }
];
