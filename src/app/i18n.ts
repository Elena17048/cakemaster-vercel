import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';



const namespaces = [
    'common', 
    'home', 
    'fast-order',
    'cakes',
    'courses',
    'about',
    'weddings',
    'corporate',
    'printing',
    'christmas',
    'halloween',
    'contact',
    'success'
];

i18n
  .use(HttpApi)
  .use(initReactI18next)
  .init({
    lng: 'cs', // Set default language to Czech
    supportedLngs: ['en', 'cs'],
    fallbackLng: 'cs',
    defaultNS: 'common',
    ns: namespaces,
    debug: false,
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    react: {
      useSuspense: false, // Set to false to avoid suspense issues with Next.js App Router
    },
  });

export default i18n;
