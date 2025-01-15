import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
// @ts-ignore
import { AppI18nNextKey } from "@/config/storageKey";
import Cache from "i18next-localstorage-cache";
import { initLitI18n } from "lit-i18n";
import enUS from "./en-US/translate.json";
import zhHK from "./zh-HK/translate.json";

export const defaultLang = "en-US";

const I18nCacheMap = new Map<string, string>([
  ["en-US", Symbol("en-US").toString()],
  ["zh-HK", Symbol("zh-HK").toString()],
]);

export class I18nUtil {
  static init() {
    const _lang = I18nUtil.getLocale();
    i18next
      .use(Cache)
      .use(LanguageDetector)
      .use(initLitI18n)
      .init({
        lng: _lang,
        fallbackLng: defaultLang,
        resources: {
          "en-US": {
            translation: enUS,
          },
          "zh-HK": {
            translation: zhHK,
          },
        },
      });
  }
  static getLocale() {
    return (
      i18next.language || localStorage.getItem(AppI18nNextKey) || defaultLang
    );
  }
  static async setLocale(locale: string, resourcePath?: string) {
    try {
      if (!resourcePath) {
        return i18next.changeLanguage(locale);
      }
      if (
        I18nCacheMap.has(locale) &&
        I18nCacheMap.get(locale) === resourcePath
      ) {
        return i18next.changeLanguage(locale);
      }

      /* @vite-ignore */
      const resources = await import(resourcePath);
      i18next.addResourceBundle(locale, "translation", resources.default);
      I18nCacheMap.set(locale, resourcePath);
      i18next.changeLanguage(locale);
    } catch (err) {
      console.error(`Failed to load ${locale} from ${resourcePath}`);
    }
  }
}
