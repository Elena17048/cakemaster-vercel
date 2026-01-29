import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    fallbackLng: "cs",
    supportedLngs: ["cs", "en"],

    ns: [
      "common",
      "home",
      "corporate",
      "weddings",
      "contact",
      "cakes",
      "fast-order",
      "printing",
      "christmas",
      "halloween",
      "courses",
      "success",
      "about",
      "constructor",
    ],

    defaultNS: "common",

    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
