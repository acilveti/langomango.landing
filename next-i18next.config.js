module.exports = {
  i18n: {
    defaultLocale: 'en',
    //locales: ['en', 'es'],
    locales: ['en'],
    //localeDetection: true,
  },
  localePath: 'public/locales',
  reloadOnPrerender: process.env.NODE_ENV === 'development'
}