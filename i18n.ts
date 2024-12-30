import * as RNLocalize from "react-native-localize";
import { I18n } from "i18n-js";
import en from "./locales/en.json";
import es from "./locales/es.json";
import fr from "./locales/fr.json";

const i18n = new I18n({
  en,
  es,
  fr,
});

i18n.locale = RNLocalize.getLocales()[0].languageCode;
i18n.enableFallback = true;

console.log(RNLocalize.getLocales()[0].languageCode);
console.log(i18n.locale);

export default i18n;
