import { Locale, DEFAULT_LOCALE } from "@/types/i18n";

export const UI_STRINGS: Record<string, Record<Locale, string>> = {
  // Navigation
  "nav.home": {
    hy: "Գլխավոր Էջ",
    en: "Home",
    ru: "Главная",
  },
  "nav.about": {
    hy: "Մեր մասին",
    en: "About Us",
    ru: "О нас",
  },
  "nav.civilizations": {
    hy: "Քաղաքակրթություններ",
    en: "Civilizations",
    ru: "Цивилизации",
  },
  "nav.library": {
    hy: "Գրադարան",
    en: "Library",
    ru: "Библиотека",
  },
  "nav.dialogue": {
    hy: "Երկխոսության հարթակ",
    en: "Dialogue Platform",
    ru: "Платформа диалога",
  },
  "nav.forum": {
    hy: "Ֆորում",
    en: "Forum",
    ru: "Форум",
  },
  "nav.admin": {
    hy: "🛡 Ադմին",
    en: "🛡 Admin",
    ru: "🛡 Админ",
  },
  "nav.login": {
    hy: "Մուտք",
    en: "Sign In",
    ru: "Войти",
  },
  "nav.profile": {
    hy: "Պրոֆիլ",
    en: "Profile",
    ru: "Профиль",
  },

  // AI translation notices
  "ai.badge": {
    hy: "",
    en: "Translated by AI",
    ru: "Переведено ИИ",
  },
  "ai.notice.short": {
    hy: "",
    en: "Content translated from Armenian by AI",
    ru: "Контент переведен с армянского с помощью ИИ",
  },
  "ai.notice.detailed": {
    hy: "",
    en: "Original texts are written and curated in Armenian. This version has been automatically translated by AI.",
    ru: "Оригинальные тексты подготовлены на армянском языке. Данная версия автоматически переведена с помощью ИИ.",
  },
  "ai.originalNotice": {
    hy: "",
    en: "View original Armenian text",
    ru: "Посмотреть оригинал на армянском",
  },

  // Actions & Buttons
  "btn.readMore": {
    hy: "Կարդալ ավելին",
    en: "Read More",
    ru: "Читать далее",
  },
  "btn.close": {
    hy: "Փակել",
    en: "Close",
    ru: "Закрыть",
  },
  "btn.translateAi": {
    hy: "🌐 Թարգմանել AI-ով (EN, RU)",
    en: "🌐 Translate with AI",
    ru: "🌐 Перевести с помощью ИИ",
  },
  "btn.translating": {
    hy: "Թարգմանվում է AI-ով...",
    en: "Translating with AI...",
    ru: "Переводится с помощью ИИ...",
  },
  "btn.translatedSuccess": {
    hy: "✓ Թարգմանությունը պահպանվեց Firestore-ում",
    en: "✓ Translations saved to Firestore",
    ru: "✓ Переводы сохранены в Firestore",
  },
  "theme.dark": {
    hy: "Անցնել Մուգ Թեմային",
    en: "Switch to Dark Mode",
    ru: "Переключить на темную тему",
  },
  "theme.light": {
    hy: "Անցնել Լուսավոր Թեմային",
    en: "Switch to Light Mode",
    ru: "Переключить на светлую тему",
  },

  // Common UI
  "common.back": {
    hy: "← Ետ",
    en: "← Back",
    ru: "← Назад",
  },
  "common.loading": {
    hy: "Բեռնվում է...",
    en: "Loading...",
    ru: "Загрузка...",
  },
  "common.search": {
    hy: "Որոնել...",
    en: "Search...",
    ru: "Поиск...",
  },
  "common.save": {
    hy: "Պահպանել",
    en: "Save",
    ru: "Сохранить",
  },
  "common.cancel": {
    hy: "Չեղարկել",
    en: "Cancel",
    ru: "Отмена",
  },
  "common.edit": {
    hy: "Խմբագրել",
    en: "Edit",
    ru: "Редактировать",
  },
  "common.delete": {
    hy: "Հեռացնել",
    en: "Delete",
    ru: "Удалить",
  },

  // Profile Page
  "profile.pageTitle": {
    hy: "Անձնական Տիրույթ",
    en: "Personal Profile",
    ru: "Личный профиль",
  },
  "profile.needLogin": {
    hy: "Ձեր պրոֆիլը տեսնելու համար անհրաժեշտ է մուտք գործել համակարգ:",
    en: "You need to sign in to view your profile.",
    ru: "Для просмотра профиля необходимо войти в систему.",
  },
  "profile.loginBtn": {
    hy: "Մուտք Գործել →",
    en: "Sign In →",
    ru: "Войти →",
  },
  "profile.logout": {
    hy: "Դուրս գալ",
    en: "Sign Out",
    ru: "Выйти",
  },
  "profile.personalData": {
    hy: "Անձնական Տվյալներ",
    en: "Personal Information",
    ru: "Персональные данные",
  },
  "profile.displayName": {
    hy: "Անուն Ազգանուն",
    en: "Full Name",
    ru: "Имя Фамилия",
  },
  "profile.affiliationTitle": {
    hy: "Պաշտոն / Ուղղվածություն",
    en: "Title / Specialization",
    ru: "Должность / Специализация",
  },
  "profile.civilizationAffiliation": {
    hy: "Քաղաքակրթական Հարություն / Պատկանելություն",
    en: "Civilizational Affiliation",
    ru: "Цивилизационная принадлежность",
  },
  "profile.bio": {
    hy: "Կենսագրություն / Նկարագրություն",
    en: "Biography / Description",
    ru: "Биография / Описание",
  },
  "profile.saveChanges": {
    hy: "Պահպանել Փոփոխությունները",
    en: "Save Changes",
    ru: "Сохранить изменения",
  },
  "profile.saving": {
    hy: "Պահպանվում է...",
    en: "Saving...",
    ru: "Сохранение...",
  },
  "profile.savedSuccess": {
    hy: "Փոփոխությունները հաջողությամբ պահպանվեցին:",
    en: "Changes saved successfully!",
    ru: "Изменения успешно сохранены!",
  },
  "profile.adminSection": {
    hy: "Ադմինիստրատիվ Գործիքներ",
    en: "Administrative Tools",
    ru: "Административные инструменты",
  },

  // Publications / Library
  "pub.title": {
    hy: "Գրադարան և Գիտական Աշխատություններ",
    en: "Library & Scholarly Works",
    ru: "Библиотека и научные труды",
  },
  "pub.subtitle": {
    hy: "8 քաղաքակրթությունների մտավոր կենտրոնների և փիլիսոփաների աշխատությունները",
    en: "Scholarly publications and treatises from think tanks and philosophers of the 8 civilizations",
    ru: "Научные публикации и труды аналитических центров и мыслителей 8 цивилизаций",
  },
  "pub.searchPlaceholder": {
    hy: "Որոնել ըստ վերնագրի, հեղինակի, կենտրոնի կամ թեմայի...",
    en: "Search by title, author, think tank or topic...",
    ru: "Поиск по названию, автору, центру или теме...",
  },
  "pub.filterAllCivs": {
    hy: "Բոլոր քաղաքակրթությունները",
    en: "All Civilizations",
    ru: "Все цивилизации",
  },
  "pub.filterAllTypes": {
    hy: "Բոլոր տեսակները",
    en: "All Types",
    ru: "Все типы",
  },
  "pub.onlyPdf": {
    hy: "Միայն PDF ունեցողները",
    en: "Only with PDF",
    ru: "Только с PDF",
  },
  "pub.sortBy": {
    hy: "Դասավորել ըստ",
    en: "Sort by",
    ru: "Сортировать по",
  },
  "pub.sortNewest": {
    hy: "Նորագույնները",
    en: "Newest First",
    ru: "Сначала новые",
  },
  "pub.sortTitle": {
    hy: "Վերնագրի (Ա-Ֆ)",
    en: "Title (A-Z)",
    ru: "По названию (А-Я)",
  },
  "pub.sortPages": {
    hy: "Էջերի քանակի",
    en: "Page Count",
    ru: "По числу страниц",
  },
  "pub.readOnline": {
    hy: "Կարդալ Առցանց",
    en: "Read Online",
    ru: "Читать онлайн",
  },
  "pub.downloadPdf": {
    hy: "Ներբեռնել PDF",
    en: "Download PDF",
    ru: "Скачать PDF",
  },
  "pub.pagesCount": {
    hy: "էջ",
    en: "pages",
    ru: "стр.",
  },
  "pub.notFound": {
    hy: "Աշխատություններ չեն գտնվել տրված պայմաններով:",
    en: "No publications found matching your criteria.",
    ru: "Публикации по заданным критериям не найдены.",
  },
  "pub.details": {
    hy: "Աշխատության Մանրամասներ",
    en: "Publication Details",
    ru: "Подробности публикации",
  },
  "pub.author": {
    hy: "Հեղինակ",
    en: "Author",
    ru: "Автор",
  },
  "pub.center": {
    hy: "Գիտական Կենտրոն",
    en: "Research Center",
    ru: "Научный центр",
  },
  "pub.year": {
    hy: "Տարեթիվ",
    en: "Year",
    ru: "Год",
  },

  // Think Tanks / Centers & Authors
  "center.mission": {
    hy: "Գիտահետազոտական Առաքելություն և Գործունեություն",
    en: "Research Mission & Activities",
    ru: "Исследовательская миссия и деятельность",
  },
  "center.authors": {
    hy: "Կապակցված Հեղինակներ և Մտածողներ",
    en: "Affiliated Scholars & Thinkers",
    ru: "Связанные авторы и мыслители",
  },
  "center.publications": {
    hy: "Կենտրոնի Աշխատություններ",
    en: "Center Publications",
    ru: "Публикации центра",
  },
  "author.quote": {
    hy: "Գաղափարական Պատգամ / Մեջբերում",
    en: "Philosophical Credo / Quote",
    ru: "Идейное кредо / Цитата",
  },
  "author.bio": {
    hy: "Կենսագրություն և Գաղափարական Ժառանգություն",
    en: "Biography & Intellectual Heritage",
    ru: "Биография и интеллектуальное наследие",
  },
  "author.publications": {
    hy: "Հեղինակի Աշխատություններ",
    en: "Author's Works",
    ru: "Труды автора",
  },

  // Dialogue Platform
  "dialogue.hubTitle": {
    hy: "Քաղաքակրթական Երկխոսության Հարթակ",
    en: "Civilizational Dialogue Platform",
    ru: "Платформа цивилизационного диалога",
  },
  "dialogue.topics": {
    hy: "Քննարկման Թեմաներ",
    en: "Dialogue Topics",
    ru: "Темы для обсуждения",
  },
  "dialogue.suggest": {
    hy: "Առաջարկել Թեմա",
    en: "Suggest a Topic",
    ru: "Предложить тему",
  },
  "dialogue.comments": {
    hy: "Կարծիքներ և Մեկնաբանություններ",
    en: "Opinions & Comments",
    ru: "Мнения и комментарии",
  },

  // Forum
  "forum.dates": {
    hy: "Ֆորումի Անցկացման Ժամկետներ",
    en: "Forum Dates & Schedule",
    ru: "Сроки проведения форума",
  },
  "forum.manifesto": {
    hy: "Ֆորումի Մանիֆեստ",
    en: "Forum Manifesto",
    ru: "Манифест форума",
  },
  "forum.agenda": {
    hy: "Օրակարգ",
    en: "Agenda",
    ru: "Повестка дня",
  },
  "forum.organizers": {
    hy: "Կազմկոմիտե և Կազմակերպիչներ",
    en: "Organizing Committee",
    ru: "Оргкомитет и организаторы",
  },
  "forum.consensus": {
    hy: "Քաղաքակրթական Կոնսենսուս",
    en: "Civilizational Consensus",
    ru: "Цивилизационный консенсус",
  },
};

/**
 * Returns a static UI translation string.
 */
export function t(key: string, locale: Locale): string {
  const entry = UI_STRINGS[key];
  if (!entry) return key;
  return entry[locale] || entry[DEFAULT_LOCALE] || key;
}

/**
 * Checks if a specific object or its active locale translation was translated by AI.
 */
export function isAiTranslated(data: unknown, locale: Locale): boolean {
  if (!data || typeof data !== "object" || locale === "hy") return false;
  const trans = (data as { translations?: Record<string, { _isAiTranslated?: boolean }> }).translations;
  return Boolean(trans?.[locale]?._isAiTranslated);
}

/**
 * Helper to get a localized field from any content object.
 * Falls back to Armenian if the target translation does not exist.
 */
export function getLocalizedField<T extends Record<string, unknown>>(
  item: T | null | undefined,
  field: keyof T,
  locale: Locale
): unknown {
  if (!item) return "";
  if (locale === "hy") {
    return item[field];
  }
  const translated = (item as unknown as { translations?: Record<string, Record<string, unknown>> })
    .translations?.[locale]?.[field as string];
  if (translated !== undefined && translated !== null && translated !== "") {
    return translated;
  }
  return item[field];
}

/**
 * Applies a locale over a content object or array, returning a localized clone.
 * Falls back transparently to canonical Armenian fields.
 */
export function applyLocale<T>(content: T, locale: Locale): T {
  if (!content || locale === "hy") {
    return content;
  }

  if (Array.isArray(content)) {
    return content.map((item) => applyLocale(item, locale)) as unknown as T;
  }

  if (typeof content !== "object") {
    return content;
  }

  const obj = content as Record<string, unknown>;
  const localizedData = (obj.translations as Record<string, Record<string, unknown>> | undefined)?.[locale];

  const result: Record<string, unknown> = { ...obj };

  // If there are translated fields for this locale, overlay them
  if (localizedData && typeof localizedData === "object") {
    for (const [key, val] of Object.entries(localizedData)) {
      if (key.startsWith("_")) continue; // Skip metadata keys like _isAiTranslated
      if (val !== undefined && val !== null && val !== "") {
        result[key] = val;
      }
    }
  }

  // Handle nested arrays with sub-items (e.g. cards, centers, authors, publications, agenda)
  for (const [key, val] of Object.entries(result)) {
    if (Array.isArray(val)) {
      result[key] = val.map((item) => {
        if (typeof item === "object" && item !== null) {
          const itemTrans = (item as { translations?: Record<string, Record<string, unknown>> }).translations?.[locale];
          if (itemTrans && typeof itemTrans === "object") {
            const localizedItem: Record<string, unknown> = { ...item };
            for (const [tKey, tVal] of Object.entries(itemTrans)) {
              if (tKey.startsWith("_")) continue;
              if (tVal !== undefined && tVal !== null && tVal !== "") {
                localizedItem[tKey] = tVal;
              }
            }
            return localizedItem;
          }
        }
        return item;
      });
    }
  }

  return result as T;
}
