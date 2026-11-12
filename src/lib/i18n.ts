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
  "btn.edit": {
    hy: "Խմբագրել",
    en: "Edit",
    ru: "Редактировать",
  },
  "btn.delete": {
    hy: "Ջնջել",
    en: "Delete",
    ru: "Удалить",
  },
  "btn.details": {
    hy: "Մանրամասն",
    en: "Details",
    ru: "Подробнее",
  },
  "btn.openPage": {
    hy: "Բացել էջը →",
    en: "Open Page →",
    ru: "Открыть страницу →",
  },
  "btn.viewProfile": {
    hy: "Դիտել էջը →",
    en: "View Profile →",
    ru: "Посмотреть профиль →",
  },
  "btn.officialWebsite": {
    hy: "Պաշտոնական կայք ↗",
    en: "Official Website ↗",
    ru: "Официальный сайт ↗",
  },
  "btn.viewPdf": {
    hy: "👁 Դիտել PDF",
    en: "👁 View PDF",
    ru: "👁 Просмотр PDF",
  },
  "btn.downloadPdf": {
    hy: "⬇️ Ներբեռնել",
    en: "⬇️ Download",
    ru: "⬇️ Скачать",
  },
  "btn.downloadPdfFull": {
    hy: "Ներբեռնել PDF",
    en: "Download PDF",
    ru: "Скачать PDF",
  },
  "btn.copyCredo": {
    hy: "Պատճենել Ասելիքը",
    en: "Copy Credo",
    ru: "Копировать кредо",
  },
  "btn.copied": {
    hy: "Պատճենված է",
    en: "Copied!",
    ru: "Скопировано!",
  },
  "btn.enableEdit": {
    hy: "✏️ Միացնել Խմբագրումը",
    en: "✏️ Enable Edit Mode",
    ru: "✏️ Включить режим редактирования",
  },
  "btn.editActive": {
    hy: "Խմբագրումը՝ ԱԿՏԻՎ",
    en: "Editing: ACTIVE",
    ru: "Редактирование: АКТИВНО",
  },
  "btn.editMode": {
    hy: "Խմբագրման Ռեժիմ",
    en: "Edit Mode",
    ru: "Режим редактирования",
  },
  "btn.editProfile": {
    hy: "Խմբագրել Պրոֆիլը",
    en: "Edit Profile",
    ru: "Редактировать профиль",
  },
  "btn.editCenter": {
    hy: "Խմբագրել Կենտրոնը",
    en: "Edit Center",
    ru: "Редактировать центр",
  },
  "btn.addCenter": {
    hy: "+ Ավելացնել Կենտրոն",
    en: "+ Add Center",
    ru: "+ Добавить центр",
  },
  "btn.addAuthor": {
    hy: "+ Ավելացնել Հեղինակ",
    en: "+ Add Author",
    ru: "+ Добавить автора",
  },
  "btn.addPublication": {
    hy: "+ Ավելացնել Աշխատություն",
    en: "+ Add Publication",
    ru: "+ Добавить публикацию",
  },
  "btn.attachPublication": {
    hy: "Կցել / Ավելացնել Աշխատություն",
    en: "Attach / Add Publication",
    ru: "Прикрепить / Добавить публикацию",
  },
  "btn.attachAuthor": {
    hy: "Կցել / Ավելացնել Հեղինակ",
    en: "Attach / Add Author",
    ru: "Прикрепить / Добавить автора",
  },
  "btn.backToAllCivs": {
    hy: "Բոլոր քաղաքակրթությունները",
    en: "All Civilizations",
    ru: "Все цивилизации",
  },
  "btn.backToCiv": {
    hy: "Դեպի",
    en: "To",
    ru: "К",
  },
  "btn.backToLibrary": {
    hy: "Վերադառնալ Գրադարան",
    en: "Back to Library",
    ru: "Вернуться в библиотеку",
  },
  "btn.clearFilters": {
    hy: "Մաքրել բոլոր ֆիլտրերը",
    en: "Clear all filters",
    ru: "Очистить все фильтры",
  },
  "btn.showAllPubs": {
    hy: "Ցուցադրել բոլոր աշխատությունները",
    en: "Show all publications",
    ru: "Показать все публикации",
  },
  "about.callEyebrow": {
    hy: "ՀԱՄԱՐԱՐՉԱԿԱՆ ԿՈՉ",
    en: "CALL TO CO-CREATION",
    ru: "ПРИЗЫВ К СОТВОРЧЕСТВУ",
  },
  "btn.joinDiscussions": {
    hy: "💬 Միանալ Քննարկումներին",
    en: "💬 Join Discussions",
    ru: "💬 Присоединиться к дискуссиям",
  },
  "btn.exploreCivilizations": {
    hy: "🏛️ Դիտել Քաղաքակրթությունները",
    en: "🏛️ Explore Civilizations",
    ru: "🏛️ Исследовать цивилизации",
  },

  // Tabs & Navigation
  "tab.centers": {
    hy: "Կենտրոններ",
    en: "Think Tanks",
    ru: "Центры",
  },
  "tab.authors": {
    hy: "Հեղինակներ",
    en: "Thinkers & Scholars",
    ru: "Мыслители и авторы",
  },
  "tab.publications": {
    hy: "Գիտական Աշխատություններ",
    en: "Scholarly Works",
    ru: "Научные труды",
  },

  // Counts & Labels
  "label.centersCount": {
    hy: "կենտրոն",
    en: "centers",
    ru: "центров",
  },
  "label.authorsCount": {
    hy: "հեղինակ",
    en: "authors",
    ru: "авторов",
  },
  "label.pubsCount": {
    hy: "աշխատություն",
    en: "works",
    ru: "работ",
  },
  "label.credo": {
    hy: "Քաղաքակրթական Կոդ և Գլխավոր Ասելիք (Core Credo)",
    en: "Civilizational Code & Core Credo",
    ru: "Цивилизационный код и главное кредо",
  },
  "label.brandName": {
    hy: "Արարատյան Ֆորում",
    en: "Ararat Forum",
    ru: "Араратский Форум",
  },
  "label.keyWork": {
    hy: "Առանցքային Աշխատություն",
    en: "Key Publication",
    ru: "Ключевой труд",
  },
  "label.noKeyWork": {
    hy: "Առանցքային աշխատություն նշված չէ",
    en: "No key publication specified",
    ru: "Ключевой труд не указан",
  },
  "label.partnerInstitute": {
    hy: "Գործընկեր ինստիտուտ",
    en: "Partner Institute",
    ru: "Партнерский институт",
  },
  "label.pdfAvailable": {
    hy: "✓ PDF առկա",
    en: "✓ PDF available",
    ru: "✓ PDF доступен",
  },
  "label.onlineAvailable": {
    hy: "✓ Առցանց հասանելի",
    en: "✓ Available online",
    ru: "✓ Доступно онлайн",
  },
  "label.authorLabel": {
    hy: "Հեղինակ՝",
    en: "Author:",
    ru: "Автор:",
  },
  "label.centerLabel": {
    hy: "Կենտրոն՝",
    en: "Center:",
    ru: "Центр:",
  },
  "label.civilizationLabel": {
    hy: "Քաղաքակրթություն՝",
    en: "Civilization:",
    ru: "Цивилизация:",
  },
  "label.typeLabel": {
    hy: "Տեսակ՝",
    en: "Type:",
    ru: "Тип:",
  },
  "label.all": {
    hy: "Բոլորը",
    en: "All",
    ru: "Все",
  },
  "label.foundedIn": {
    hy: "հիմնադրված",
    en: "founded in",
    ru: "основан в",
  },
  "label.yearSuffix": {
    hy: "թ.",
    en: "",
    ru: "г.",
  },
  "label.focusAreas": {
    hy: "Հետազոտական Ուղղություններ",
    en: "Research Focus Areas",
    ru: "Направления исследований",
  },
  "label.bioAndHeritage": {
    hy: "Կենսագրություն և Գիտական Նշանակություն",
    en: "Biography & Intellectual Heritage",
    ru: "Биография и научное значение",
  },
  "label.philosophyQuote": {
    hy: "✧ Գաղափարական Պատգամ / Մեջբերում",
    en: "✧ Philosophical Credo / Quote",
    ru: "✧ Идейное кредо / Цитата",
  },
  "label.authorWorksSubtitle": {
    hy: "Հեղինակի գրքերը, մենագրությունները, վերլուծական հոդվածները և զեկույցները",
    en: "Books, monographs, analytical papers, and treatises by the author",
    ru: "Книги, монографии, аналитические статьи и доклады автора",
  },
  "label.centerWorksSubtitle": {
    hy: "Կենտրոնի հետազոտական հրապարակումները, քաղաքականության զեկույցները և մենագրությունները",
    en: "Research publications, policy papers, and treatises of the center",
    ru: "Исследовательские публикации, доклады и монографии центра",
  },
  "label.centerAuthorsSubtitle": {
    hy: "Կենտրոնի առաջատար հետազոտողները, վերլուծաբանները և գիտական մտածողները",
    en: "Leading researchers, analysts, and scientific thinkers of the center",
    ru: "Ведущие исследователи, аналитики и мыслители центра",
  },
  "label.affiliatedCenters": {
    hy: "Հարակից Ուղեղային Կենտրոններ",
    en: "Affiliated Think Tanks",
    ru: "Связанные аналитические центры",
  },
  "label.noWorksYet": {
    hy: "Աշխատություններ կամ հոդվածներ դեռ ավելացված չեն:",
    en: "No publications or papers added yet.",
    ru: "Публикации или статьи пока не добавлены.",
  },
  "label.noAuthorsYet": {
    hy: "Այս կենտրոնին դեռևս կցված չեն գիտաշխատողներ կամ հեղինակներ:",
    en: "No researchers or authors attached to this center yet.",
    ru: "К этому центру пока не прикреплены исследователи или авторы.",
  },
  "label.showingWorks": {
    hy: "Ցուցադրված է",
    en: "Showing",
    ru: "Показано",
  },

  // Search Placeholders & Empty States
  "search.centersPlaceholder": {
    hy: "Որոնել կենտրոններ, քաղաք, ոլորտ...",
    en: "Search think tanks, city, focus area...",
    ru: "Поиск центров, города, направления...",
  },
  "search.authorsPlaceholder": {
    hy: "Որոնել հեղինակ, աշխատություն...",
    en: "Search thinkers, publications...",
    ru: "Поиск авторов, трудов...",
  },
  "search.pubsPlaceholder": {
    hy: "Որոնել աշխատություն, տեսակ, թեմա...",
    en: "Search publications, type, topic...",
    ru: "Поиск трудов, типа, темы...",
  },
  "empty.centers": {
    hy: "Որոնմանը համապատասխանող կենտրոն չգտնվեց:",
    en: "No think tanks found matching your search.",
    ru: "Центры по заданному запросу не найдены.",
  },
  "empty.authors": {
    hy: "Որոնմանը համապատասխանող մտածող չգտնվեց:",
    en: "No thinkers found matching your search.",
    ru: "Мыслители по заданному запросу не найдены.",
  },
  "empty.pubs": {
    hy: "Որոնմանը համապատասխանող գիտական աշխատություն չգտնվեց:",
    en: "No publications found matching your search.",
    ru: "Публикации по заданному запросу не найдены.",
  },

  // Types
  "type.report": {
    hy: "Զեկույց",
    en: "Report",
    ru: "Доклад",
  },
  "type.monograph": {
    hy: "Մենագրություն",
    en: "Monograph",
    ru: "Монография",
  },
  "type.article": {
    hy: "Հոդված",
    en: "Article",
    ru: "Статья",
  },
  "type.book": {
    hy: "Գիրք",
    en: "Book",
    ru: "Книга",
  },
  "type.pdfDoc": {
    hy: "PDF Փաստաթուղթ",
    en: "PDF Document",
    ru: "Документ PDF",
  },

  // Forum Countdown & Headers
  "forum.days": {
    hy: "ՕՐ",
    en: "DAYS",
    ru: "ДНЕЙ",
  },
  "forum.hours": {
    hy: "ԺԱՄ",
    en: "HOURS",
    ru: "ЧАСОВ",
  },
  "forum.minutes": {
    hy: "ՐՈՊԵ",
    en: "MINUTES",
    ru: "МИНУТ",
  },
  "forum.seconds": {
    hy: "ՎԱՅՐԿՅԱՆ",
    en: "SECONDS",
    ru: "СЕКУНД",
  },
  "forum.programAndAgenda": {
    hy: "🏛️ Ֆորումի Ծրագիր և Օրակարգ",
    en: "🏛️ Forum Program & Agenda",
    ru: "🏛️ Программа и повестка форума",
  },
  "forum.committeeAndTeam": {
    hy: "👥 Կազմկոմիտե և Թիմ →",
    en: "👥 Organizing Committee & Team →",
    ru: "👥 Оргкомитет и команда →",
  },
  "forum.messagesTitle": {
    hy: "Օրակարգային 3 Ուղերձներ և Քննարկում",
    en: "3 Key Agenda Messages & Discussion",
    ru: "3 Ключевых Послания Повестки и Дискуссия",
  },
  "forum.addProposal": {
    hy: "+ Ավելացնել Առաջարկ / Դիտարկում",
    en: "+ Add Proposal / Comment",
    ru: "+ Добавить предложение / комментарий",
  },
  "forum.suggestAlternative": {
    hy: "🗓️ Առաջարկել այլընտրանքային ժամկետ / Հաստատել մասնակցությունը",
    en: "🗓️ Suggest alternative dates / Confirm attendance",
    ru: "🗓️ Предложить альтернативные сроки / Подтвердить участие",
  },
  "forum.changeTime": {
    hy: "✎ Փոխել Ժամը",
    en: "✎ Change Time",
    ru: "✎ Изменить время",
  },
  "forum.addProposalAround": {
    hy: "Ավելացնել առաջարկ",
    en: "Add proposal",
    ru: "Добавить предложение",
  },
  "forum.sendProposal": {
    hy: "Ուղարկել Առաջարկը",
    en: "Submit Proposal",
    ru: "Отправить предложение",
  },
  "forum.sending": {
    hy: "Ուղարկվում է...",
    en: "Sending...",
    ru: "Отправка...",
  },
  "forum.discussionsAndProposals": {
    hy: "Քննարկումներ և Առաջարկներ",
    en: "Discussions & Proposals",
    ru: "Дискуссии и Предложения",
  },
  "forum.noProposalsYet": {
    hy: "Այս ուղերձի շուրջ դեռ առաջարկներ չեն գրանցվել։ Եղեք առաջինը։",
    en: "No proposals registered for this message yet. Be the first.",
    ru: "По этому посланию пока нет предложений. Будьте первыми.",
  },
  "forum.reply": {
    hy: "💬 Պատասխանել",
    en: "💬 Reply",
    ru: "💬 Ответить",
  },
  "forum.delete": {
    hy: "Ջնջել",
    en: "Delete",
    ru: "Удалить",
  },
  "forum.writeReplyPlaceholder": {
    hy: "Գրեք Ձեր պատասխանը...",
    en: "Write your reply...",
    ru: "Напишите ваш ответ...",
  },
  "forum.send": {
    hy: "Ուղարկել",
    en: "Send",
    ru: "Отправить",
  },
  "forum.agendaTitle": {
    hy: "3-Օրյա Օրակարգ (Նախնական)",
    en: "3-Day Agenda (Tentative)",
    ru: "3-дневная программа (предварительная)",
  },
  "forum.agendaSubtitle": {
    hy: "Ծրագրային հիմնական հանգրվանները և քննարկումների վայրերը",
    en: "Key program milestones and discussion venues",
    ru: "Основные этапы программы и места обсуждений",
  },
  "forum.proposeAgendaAddition": {
    hy: "💡 Առաջարկել Լրացում Օրակարգում",
    en: "💡 Propose Agenda Addition",
    ru: "💡 Предложить дополнение к повестке",
  },
  "forum.addAgendaItem": {
    hy: "+ Ավելացնել Օրակարգ",
    en: "+ Add Agenda Item",
    ru: "+ Добавить пункт повестки",
  },
  "forum.leadershipEyebrow": {
    hy: "👑 ՖՈՐՈՒՄԻ ՂԵԿԱՎԱՐՈՒԹՅՈՒՆ",
    en: "👑 FORUM LEADERSHIP",
    ru: "👑 РУКОВОДСТВО ФОРУМА",
  },
  "forum.leadershipTitle": {
    hy: "Ֆորումի Ղեկավարություն և Կազմկոմիտե",
    en: "Forum Leadership & Organizing Committee",
    ru: "Руководство Форума и Оргкомитет",
  },
  "forum.viewEntireTeam": {
    hy: "👥 Դիտել Կազմկոմիտեի Ամբողջ Թիմը →",
    en: "👥 View Entire Committee Team →",
    ru: "👥 Вся команда оргкомитета →",
  },
  "forum.publicProposalsTitle": {
    hy: "Ֆորումի Հանրային Առաջարկներ և Քննարկումներ",
    en: "Forum Public Proposals & Discussions",
    ru: "Общественные предложения и дискуссии форума",
  },
  "forum.publicProposalsDesc": {
    hy: "Գիտնականների, մտածողների և մասնակիցների առաջարկները Մանիֆեստի, ուղերձների և օրակարգի շուրջ",
    en: "Proposals from scholars, thinkers, and participants on Manifesto, messages, and agenda",
    ru: "Предложения ученых, мыслителей и участников по Манифесту, посланиям и повестке",
  },
  "forum.addNewProposal": {
    hy: "+ Ավելացնել Նոր Առաջարկ",
    en: "+ Add New Proposal",
    ru: "+ Добавить новое предложение",
  },
  "forum.tabAll": {
    hy: "Բոլորը",
    en: "All",
    ru: "Все",
  },
  "forum.tabManifesto": {
    hy: "📜 Մանիֆեստ",
    en: "📜 Manifesto",
    ru: "📜 Манифест",
  },
  "forum.tabMessages": {
    hy: "💬 Ուղերձներ",
    en: "💬 Messages",
    ru: "💬 Послания",
  },
  "forum.tabAgenda": {
    hy: "🗓️ Օրակարգ",
    en: "🗓️ Agenda",
    ru: "🗓️ Повестка",
  },
  "forum.tabDateLocation": {
    hy: "📍 Ժամկետներ & Վայր",
    en: "📍 Dates & Venue",
    ru: "📍 Сроки и Место",
  },
  "forum.noProposalsSection": {
    hy: "Այս բաժնում դեռևս առաջարկներ չկան։ Սեղմեք «+ Ավելացնել Նոր Առաջարկ» առաջինը ներկայացնելու համար։",
    en: "There are no proposals in this section yet. Click '+ Add New Proposal' to submit the first one.",
    ru: "В этом разделе пока нет предложений. Нажмите «+ Добавить новое предложение», чтобы быть первым.",
  },
  "label.editActive": {
    hy: "Խմբագրումը՝ ԱԿՏԻՎ",
    en: "Editing ACTIVE",
    ru: "Редактирование АКТИВНО",
  },
  "label.editMode": {
    hy: "Խմբագրման Ռեժիմ",
    en: "Edit Mode",
    ru: "Режим Редактирования",
  },
  "label.toggleEditMode": {
    hy: "Խմբագրման ռեժիմի միացում",
    en: "Toggle edit mode",
    ru: "Включение режима редактирования",
  },
  "label.affiliatedFellow": {
    hy: "Գիտաշխատող / Անդամ",
    en: "Fellow / Member",
    ru: "Научный сотрудник / Член",
  },
  "label.viewCenterPage": {
    hy: "Դիտել կենտրոնի էջը →",
    en: "View center page →",
    ru: "Смотреть страницу центра →",
  },
  "label.viewAuthorPage": {
    hy: "Դիտել հեղինակի էջը →",
    en: "View thinker page →",
    ru: "Смотреть страницу автора →",
  },
  "label.affiliatedLinked": {
    hy: "✓ Կցված է (Անջատել)",
    en: "✓ Attached (Detach)",
    ru: "✓ Прикреплен (Открепить)",
  },
  "label.affiliateAttach": {
    hy: "＋ Կցել",
    en: "＋ Attach",
    ru: "＋ Прикрепить",
  },
  "label.affiliateAttachToCenter": {
    hy: "＋ Կցել այս կենտրոնին",
    en: "＋ Attach to this center",
    ru: "＋ Прикрепить к этому центру",
  },
  "label.affiliateAttachAuthor": {
    hy: "＋ Կցել Հեղինակին",
    en: "＋ Attach to Author",
    ru: "＋ Прикрепить к автору",
  },
  "label.affiliateAttachCenter": {
    hy: "＋ Կցել Կենտրոնին",
    en: "＋ Attach to Center",
    ru: "＋ Прикрепить к центру",
  },
  "label.pages": {
    hy: "էջ",
    en: "pages",
    ru: "стр.",
  },
  "label.adjacentThinkers": {
    hy: "Հարակից Մտածողներ",
    en: "Affiliated Thinkers",
    ru: "Связанные мыслители",
  },
  "btn.detachAuthor": {
    hy: "Անջատել այս հեղինակից",
    en: "Detach from this author",
    ru: "Открепить от этого автора",
  },
  "btn.detachCenter": {
    hy: "Անջատել այս կենտրոնից",
    en: "Detach from this center",
    ru: "Открепить от этого центра",
  },
  "btn.attachOrCreatePub": {
    hy: "+ Կցել Քաղաքակրթության Գրադարանից կամ Ստեղծել Նորը",
    en: "+ Attach from Civ Library or Create New",
    ru: "+ Прикрепить из библиотеки или создать",
  },
  "btn.attachOrCreateAuthor": {
    hy: "+ Կցել Քաղաքակրթության Հեղինակներից կամ Ստեղծել Նորը",
    en: "+ Attach from Civ Thinkers or Create New",
    ru: "+ Прикрепить из мыслителей или создать",
  },
  "btn.createAndAttach": {
    hy: "Ստեղծել և Կցել",
    en: "Create & Attach",
    ru: "Создать и прикрепить",
  },
  "btn.cancel": {
    hy: "Չեղարկել",
    en: "Cancel",
    ru: "Отмена",
  },
  "btn.save": {
    hy: "Պահպանել",
    en: "Save",
    ru: "Сохранить",
  },
  "label.modalAttachOrCreatePub": {
    hy: "Կցել կամ Ստեղծել Գիտական Աշխատություն",
    en: "Attach or Create Scholarly Work",
    ru: "Прикрепить или создать научный труд",
  },
  "label.modalAttachOrCreateAuthor": {
    hy: "Կցել կամ Ստեղծել Հեղինակ",
    en: "Attach or Create Thinker",
    ru: "Прикрепить или создать автора",
  },
  "label.selectFromCivLib": {
    hy: "Ընտրել Քաղաքակրթության Գրադարանից",
    en: "Select from Civilization Library",
    ru: "Выбрать из библиотеки цивилизации",
  },
  "label.createNewPub": {
    hy: "Ստեղծել Նոր Աշխատություն",
    en: "Create New Publication",
    ru: "Создать новую публикацию",
  },
  "label.selectFromCivAuthors": {
    hy: "Ընտրել Քաղաքակրթության Հեղինակներից",
    en: "Select from Civilization Thinkers",
    ru: "Выбрать из авторов цивилизации",
  },
  "label.createNewAuthor": {
    hy: "Ստեղծել Նոր Հեղինակ",
    en: "Create New Thinker",
    ru: "Создать нового автора",
  },
  "label.canAttachExistingPubs": {
    hy: "Կարող եք կցել արդեն իսկ քաղաքակրթության գրադարանում առկա աշխատությունները:",
    en: "You can attach works already available in the civilization library.",
    ru: "Вы можете прикрепить труды, уже имеющиеся в библиотеке цивилизации.",
  },
  "empty.noPubsInCivYet": {
    hy: "Այս քաղաքակրթությունում դեռևս առանձին աշխատություններ չկան: Օգտվեք «Ստեղծել Նոր Աշխատություն» ներդիրից:",
    en: "There are no individual publications in this civilization yet. Use the 'Create New Publication' tab.",
    ru: "В этой цивилизации пока нет отдельных публикаций. Воспользуйтесь вкладкой «Создать новую публикацию».",
  },
  "empty.noAuthorsInCivYet": {
    hy: "Այս քաղաքակրթությունում դեռևս առանձին հեղինակներ չկան: Օգտվեք «Ստեղծել Նոր Հեղինակ» ներդիրից:",
    en: "There are no individual thinkers in this civilization yet. Use the 'Create New Thinker' tab.",
    ru: "В этой цивилизации пока нет отдельных мыслителей. Воспользуйтесь вкладкой «Создать нового автора».",
  },
  "search.pubsModalPlaceholder": {
    hy: "Որոնել աշխատությունը ըստ վերնագրի կամ տեսակի...",
    en: "Search publication by title or type...",
    ru: "Поиск публикации по названию или типу...",
  },
  "search.authorsModalPlaceholder": {
    hy: "Որոնել հեղինակին ըստ անվան...",
    en: "Search thinker by name...",
    ru: "Поиск мыслителя по имени...",
  },
  "label.pubTitle": {
    hy: "Աշխատության Վերնագիր",
    en: "Publication Title",
    ru: "Название публикации",
  },
  "label.pubType": {
    hy: "Տեսակ",
    en: "Type",
    ru: "Тип",
  },
  "label.pubYear": {
    hy: "Հրատարակման Տարեթիվ",
    en: "Publication Year",
    ru: "Год публикации",
  },
  "label.pubPages": {
    hy: "Էջերի Քանակ",
    en: "Page Count",
    ru: "Количество страниц",
  },
  "label.attachedCenterOptional": {
    hy: "Կից Ուղեղային Կենտրոն (ընտրովի)",
    en: "Affiliated Think Tank (optional)",
    ru: "Связанный мозговой центр (опционально)",
  },
  "label.attachedAuthorOptional": {
    hy: "Հեղինակ (ընտրովի կցում)",
    en: "Author (optional)",
    ru: "Автор (опционально)",
  },
  "label.noSpecificCenter": {
    hy: "Առանց կոնկրետ կենտրոնի",
    en: "Without specific center",
    ru: "Без конкретного центра",
  },
  "label.noSpecificAuthor": {
    hy: "Առանց կոնկրետ հեղինակի",
    en: "Without specific author",
    ru: "Без конкретного автора",
  },
  "label.summaryAbstract": {
    hy: "Ամփոփագիր / Գիտական Թեզիսներ",
    en: "Abstract / Scientific Theses",
    ru: "Аннотация / Научные тезисы",
  },
  "label.summaryAndScientificDesc": {
    hy: "Ամփոփագիր և Գիտական Նկարագիր",
    en: "Abstract & Scientific Overview",
    ru: "Аннотация и научный обзор",
  },
  "label.dialogueFilterAll": {
    hy: "Բոլորը",
    en: "All",
    ru: "Все",
  },
  "label.dialogueFilterActive": {
    hy: "Ակտիվ",
    en: "Active",
    ru: "Активные",
  },
  "label.dialogueFilterPending": {
    hy: "Հաստատման սպասող",
    en: "Pending",
    ru: "На утверждении",
  },
  "label.dialogueFilterArchived": {
    hy: "Արխիվացված",
    en: "Archived",
    ru: "В архиве",
  },
  "dialogue.opinionsCount": {
    hy: "կարծիք",
    en: "opinions",
    ru: "мнений",
  },
  "dialogue.expertsCount": {
    hy: "փորձագետ",
    en: "experts",
    ru: "экспертов",
  },
  "dialogue.participate": {
    hy: "Մասնակցել Քննարկմանը",
    en: "Join Discussion",
    ru: "Участвовать в обсуждении",
  },
  "dialogue.viewDiscussion": {
    hy: "Դիտել Քննարկումը",
    en: "View Discussion",
    ru: "Смотреть обсуждение",
  },
  "dialogue.viewProposal": {
    hy: "Դիտել Առաջարկը",
    en: "View Proposal",
    ru: "Смотреть предложение",
  },
  "dialogue.proposeNewTopicAdmin": {
    hy: "+ Առաջարկել Նոր Հարցադրում (Admin)",
    en: "+ Propose New Topic (Admin)",
    ru: "+ Предложить новую тему (Админ)",
  },
  "dialogue.proposeNewTopic": {
    hy: "💡 Առաջարկել Հարցադրում Քննարկման Համար",
    en: "💡 Propose Topic for Discussion",
    ru: "💡 Предложить тему для обсуждения",
  },
  "dialogue.noTopicsFound": {
    hy: "Համապատասխան հարցադրում չի գտնվել",
    en: "No matching topics found",
    ru: "Подходящих тем не найдено",
  },
  "dialogue.clearFilters": {
    hy: "Մաքրել ֆիլտրերը",
    en: "Clear filters",
    ru: "Сбросить фильтры",
  },
  "stats.totalPubs": {
    hy: "Ընդհանուր Աշխատություններ",
    en: "Total Publications",
    ru: "Всего публикаций",
  },
  "stats.digitalPdfs": {
    hy: "Թվային PDF Փաստաթղթեր",
    en: "Digital PDF Documents",
    ru: "Цифровые PDF документы",
  },
  "stats.researchCenters": {
    hy: "Գիտական Կենտրոններ",
    en: "Research Centers",
    ru: "Научные центры",
  },
  "stats.scholarsThinkers": {
    hy: "Մտածողներ և Հեղինակներ",
    en: "Scholars & Thinkers",
    ru: "Мыслители и авторы",
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

  // Auth Page
  "auth.alreadyLoggedIn": {
    hy: "Դուք արդեն մուտք եք գործել",
    en: "You are already signed in",
    ru: "Вы уже вошли в систему",
  },
  "auth.loggedInAs": {
    hy: "Մուտք եք գործել որպես",
    en: "Signed in as",
    ru: "Вы вошли как",
  },
  "auth.myProfile": {
    hy: "Իմ Պրոֆիլը →",
    en: "My Profile →",
    ru: "Мой Профиль →",
  },
  "auth.homePage": {
    hy: "Գլխավոր Էջ",
    en: "Home Page",
    ru: "Главная страница",
  },
  "auth.signIn": {
    hy: "Մուտք (Sign In)",
    en: "Sign In",
    ru: "Вход",
  },
  "auth.signUp": {
    hy: "Գրանցում (Sign Up)",
    en: "Sign Up",
    ru: "Регистрация",
  },
  "auth.signInTitle": {
    hy: "Մուտք Համակարգ",
    en: "Sign In",
    ru: "Вход в систему",
  },
  "auth.signUpTitle": {
    hy: "Անդամագրում Կենտրոնին",
    en: "Join the Center",
    ru: "Регистрация в центре",
  },
  "auth.subtitle": {
    hy: "Արարատյան Քաղաքակրթական Կենտրոնի Անձնական Տիրույթ",
    en: "Personal Portal of the Ararat Civilizational Center",
    ru: "Личный кабинет Араратского Цивилизационного Центра",
  },
  "auth.fullName": {
    hy: "Անուն Ազգանուն",
    en: "Full Name",
    ru: "Имя Фамилия",
  },
  "auth.fullNamePlaceholder": {
    hy: "օրինակ՝ Արմեն Ղազարյան",
    en: "e.g., Armen Ghazaryan",
    ru: "например, Армен Казарян",
  },
  "auth.email": {
    hy: "Էլ. Փոստ (Email)",
    en: "Email Address",
    ru: "Эл. Почта",
  },
  "auth.password": {
    hy: "Գաղտնաբառ (Password)",
    en: "Password",
    ru: "Пароль",
  },
  "auth.forgotPassword": {
    hy: "Մոռացե՞լ եք գաղտնաբառը",
    en: "Forgot password?",
    ru: "Забыли пароль?",
  },
  "auth.reset": {
    hy: "Վերականգնե՞լ",
    en: "Reset?",
    ru: "Восстановить?",
  },
  "auth.fieldOfInterest": {
    hy: "Քաղաքակրթական Ոլորտ / Հետաքրքրություն",
    en: "Civilizational Area / Interest",
    ru: "Цивилизационная сфера / Интерес",
  },
  "auth.submitSignIn": {
    hy: "Մուտք Գործել",
    en: "Sign In",
    ru: "Войти",
  },
  "auth.submitSignUp": {
    hy: "Գրանցվել որպես Անդամ",
    en: "Register as Member",
    ru: "Зарегистрироваться",
  },
  "auth.processing": {
    hy: "Մշակվում է...",
    en: "Processing...",
    ru: "Обработка...",
  },
  "auth.or": {
    hy: "Կամ",
    en: "Or",
    ru: "Или",
  },
  "auth.continueGoogle": {
    hy: "Շարունակել Google-ով",
    en: "Continue with Google",
    ru: "Продолжить с Google",
  },

  // Forum Organizers
  "organizers.backToForum": {
    hy: "← Վերադառնալ Ֆորումի Գլխավոր Էջ",
    en: "← Back to Forum Main Page",
    ru: "← На главную страницу форума",
  },
  "organizers.setOwner": {
    hy: "👑 Սահմանել Ղեկավարին",
    en: "👑 Set Forum Leader",
    ru: "👑 Назначить руководителя",
  },
  "organizers.addMember": {
    hy: "+ Ավելացնել Կազմկոմիտեի Անդամ",
    en: "+ Add Committee Member",
    ru: "+ Добавить члена оргкомитета",
  },
  "organizers.eyebrow": {
    hy: "Արարատյան Քաղաքակրթական Ֆորում 2027",
    en: "Ararat Civilizational Forum 2027",
    ru: "Араратский Цивилизационный Форум 2027",
  },
  "organizers.title": {
    hy: "Ֆորումի Ղեկավարություն և Կազմկոմիտե",
    en: "Forum Leadership & Organizing Committee",
    ru: "Руководство Форума и Оргкомитет",
  },
  "organizers.subtitle": {
    hy: "Արարատյան Ֆորումի գլխավոր համակարգողը, գիտական քարտուղարությունը և կազմկոմիտեի անդամները, ովքեր համակարգում են քաղաքակրթական երկխոսության նախապատրաստական աշխատանքները։",
    en: "The General Coordinator, Scientific Secretariat, and Committee members coordinating preparatory work for the civilizational dialogue.",
    ru: "Главный координатор, ученый секретариат и члены оргкомитета, координирующие подготовительную работу к цивилизационному диалогу.",
  },
  "organizers.ownerBadge": {
    hy: "👑 ՖՈՐՈՒՄԻ ԳԼԽԱՎՈՐ ՀԱՄԱԿԱՐԳՈՂ & ՂԵԿԱՎԱՐ",
    en: "👑 GENERAL COORDINATOR & FORUM LEADER",
    ru: "👑 ГЛАВНЫЙ КООРДИНАТОР И РУКОВОДИТЕЛЬ ФОРУМА",
  },
  "organizers.editOwner": {
    hy: "✎ Խմբագրել Ղեկավարին",
    en: "✎ Edit Leader",
    ru: "✎ Редактировать руководителя",
  },
  "organizers.visionResponsibility": {
    hy: "Ռազմավարական Տեսլական & Պատասխանատվություն",
    en: "Strategic Vision & Responsibility",
    ru: "Стратегическое видение и ответственность",
  },
  "organizers.committeeMembers": {
    hy: "Կազմկոմիտեի Անդամներ",
    en: "Organizing Committee Members",
    ru: "Члены Оргкомитета",
  },
  "organizers.membersCount": {
    hy: "անդամ",
    en: "members",
    ru: "членов",
  },
  "organizers.commissionsSubtitle": {
    hy: "Գիտական, միջազգային, գործառնական և թվային հանձնախմբեր",
    en: "Scientific, international, operational, and digital teams",
    ru: "Научные, международные, операционные и цифровые группы",
  },
  "organizers.searchPlaceholder": {
    hy: "Փնտրել ըստ անվան, դերի կամ կենտրոնի...",
    en: "Search by name, role, or center...",
    ru: "Поиск по имени, роли или центру...",
  },
  "organizers.filterAll": {
    hy: "Բոլոր Հանձնախմբերը",
    en: "All Departments",
    ru: "Все направления",
  },
  "organizers.filterLeadership": {
    hy: "👑 Ղեկավարություն",
    en: "👑 Leadership",
    ru: "👑 Руководство",
  },
  "organizers.filterAcademic": {
    hy: "📚 Գիտական Քարտուղարություն",
    en: "📚 Scientific Secretariat",
    ru: "📚 Ученый секретариат",
  },
  "organizers.filterInternational": {
    hy: "🌐 Միջազգային Համագործակցություն",
    en: "🌐 International Relations",
    ru: "🌐 Международные связи",
  },
  "organizers.filterOperations": {
    hy: "⚙️ Լոգիստիկա & Թվային Մեդիա",
    en: "⚙️ Logistics & Digital Media",
    ru: "⚙️ Логистика и медиа",
  },
  "organizers.noMembersFound": {
    hy: "Տվյալ որոնմամբ անդամներ չեն գտնվել։",
    en: "No committee members found matching your search.",
    ru: "Члены оргкомитета по данному запросу не найдены.",
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
  "civ.chinese": {
    hy: "Չինական քաղաքակրթություն",
    en: "Chinese Civilization",
    ru: "Китайская цивилизация",
  },
  "civ.armenian": {
    hy: "Հայկական քաղաքակրթություն",
    en: "Armenian Civilization",
    ru: "Армянская цивилизация",
  },
  "civ.russian": {
    hy: "Ռուսական քաղաքակրթություն",
    en: "Russian Civilization",
    ru: "Русская цивилизация",
  },
  "civ.european": {
    hy: "Եվրոպական քաղաքակրթություն",
    en: "European Civilization",
    ru: "Европейская цивилизация",
  },
  "civ.iranian": {
    hy: "Իրանական քաղաքակրթություն",
    en: "Iranian Civilization",
    ru: "Иранская цивилизация",
  },
  "civ.arabic": {
    hy: "Արաբական քաղաքակրթություն",
    en: "Arabic Civilization",
    ru: "Арабская цивилизация",
  },
  "civ.greek": {
    hy: "Հունական քաղաքակրթություն",
    en: "Greek Civilization",
    ru: "Греческая цивилизация",
  },
  "civ.indian": {
    hy: "Հնդկական քաղաքակրթություն",
    en: "Indian Civilization",
    ru: "Индийская цивилизация",
  },
  "civ.short.chinese": {
    hy: "Չինական",
    en: "Chinese",
    ru: "Китайская",
  },
  "civ.short.armenian": {
    hy: "Հայկական",
    en: "Armenian",
    ru: "Армянская",
  },
  "civ.short.russian": {
    hy: "Ռուսական",
    en: "Russian",
    ru: "Русская",
  },
  "civ.short.european": {
    hy: "Եվրոպական",
    en: "European",
    ru: "Европейская",
  },
  "civ.short.iranian": {
    hy: "Իրանական",
    en: "Iranian",
    ru: "Иранская",
  },
  "civ.short.arabic": {
    hy: "Արաբական",
    en: "Arabic",
    ru: "Арабская",
  },
  "civ.short.greek": {
    hy: "Հունական",
    en: "Greek",
    ru: "Греческая",
  },
  "civ.short.indian": {
    hy: "Հնդկական",
    en: "Indian",
    ru: "Индийская",
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

export const KNOWN_CONTENT_TRANSLATIONS: Record<string, { en: string; ru: string }> = {
  // Home cards
  "Քաղաքակրթական Բևեռներ": {
    en: "Civilizational Poles",
    ru: "Цивилизационные полюса",
  },
  "Բացահայտեք 8 ավանդական քաղաքակրթությունների մտավոր կենտրոններն ու առաջատար մտածողներին։": {
    en: "Discover the intellectual centers and leading thinkers of the 8 traditional civilizations.",
    ru: "Откройте для себя интеллектуальные центры и ведущих мыслителей 8 традиционных цивилизаций.",
  },
  "Երկխոսության Հարթակ": {
    en: "Dialogue Platform",
    ru: "Платформа диалога",
  },
  "Միացեք նախնական քննարկումներին, ուսումնասիրեք գիտական գրադարանը և ներկայացրեք ձեր տեսակետը։": {
    en: "Join preparatory discussions, explore the scholarly library, and present your perspective.",
    ru: "Присоединяйтесь к дискуссиям, изучайте научную библиотеку и высказывайте свою точку зрения.",
  },
  "Ֆորում": {
    en: "Forum",
    ru: "Форум",
  },
  "Ծանոթացեք Ֆորումի հայեցակարգային Մանիֆեստին, օրակարգին և դարձեք գործընթացի համահեղինակ։": {
    en: "Explore the conceptual Manifesto of the Forum, view the agenda, and become a co-author of the process.",
    ru: "Ознакомьтесь с концептуальным Манифестом Форума, повесткой дня и станьте соавтором процесса.",
  },
  // Home Hero & Credo
  "Քաղաքակրթական Երկխոսությունների Արարատյան Ֆորում": {
    en: "Ararat Forum of Civilizational Dialogues",
    ru: "Араратский форум цивилизационных диалогов",
  },
  "Քաղաքակրթական Ճգնաժամ, Կոդեր, Արժեքներ և Համարարչություն": {
    en: "Civilizational Crisis, Codes, Values and Co-creation",
    ru: "Цивилизационный кризис, коды, ценности и со-созидание",
  },
  "«Քաղաքակրթական ճգնաժամը պարտադրում է արարող քաղաքակրթությունների երկխոսություն, որի շնորհիվ է հնարավոր ապահովել քաղաքակրթական անցումը և Արդար աշխարհակարգի կառուցումը»։": {
    en: "\"The civilizational crisis necessitates dialogue among creator civilizations, which alone makes it possible to ensure civilizational transition and build a Just World Order.\"",
    ru: "«Цивилизационный кризис требует диалога созидательных цивилизаций, благодаря которому возможно обеспечить цивилизационный переход и построение Справедливого миропорядка».",
  },
  // Civilizations Page
  "8 Քաղաքակրթական Բևեռներ և Մտածողներ": {
    en: "8 Civilizational Poles and Thinkers",
    ru: "8 цивилизационных полюсов и мыслителей",
  },
  "Քաղաքակրթական Համարարչություն": {
    en: "Civilizational Co-creation",
    ru: "Цивилизационное со-созидание",
  },
  "Ընտրեք 8 ավանդական քաղաքակրթություններից որևէ մեկը՝ ծանոթանալու նրանց գաղափարական կոդին (Core Credo), առաջատար ուղեղային կենտրոններին և մեծագույն մտածողների ժառանգությանը։": {
    en: "Select any of the 8 traditional civilizations to explore their ideological code (Core Credo), leading think tanks, and the intellectual legacy of their greatest thinkers.",
    ru: "Выберите любую из 8 традиционных цивилизаций, чтобы познакомиться с их идеологическим кодом (Core Credo), ведущими аналитическими центрами и наследием мыслителей.",
  },
};

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

  // Fallback translation for known canonical strings if not already translated
  for (const [key, val] of Object.entries(result)) {
    if (typeof val === "string") {
      const known = KNOWN_CONTENT_TRANSLATIONS[val.trim()];
      if (known && (locale === "en" || locale === "ru")) {
        result[key] = known[locale];
      }
    }
  }

  // Handle nested arrays with sub-items (e.g. cards, centers, authors, publications, agenda)
  for (const [key, val] of Object.entries(result)) {
    if (Array.isArray(val)) {
      result[key] = val.map((item) => {
        if (typeof item === "object" && item !== null) {
          const itemTrans = (item as { translations?: Record<string, Record<string, unknown>> }).translations?.[locale];
          const localizedItem: Record<string, unknown> = { ...item };

          if (itemTrans && typeof itemTrans === "object") {
            for (const [tKey, tVal] of Object.entries(itemTrans)) {
              if (tKey.startsWith("_")) continue;
              if (tVal !== undefined && tVal !== null && tVal !== "") {
                localizedItem[tKey] = tVal;
              }
            }
          }

          // Fallback to known canonical translations for nested card fields (title, description, etc.)
          for (const [subKey, subVal] of Object.entries(localizedItem)) {
            if (typeof subVal === "string") {
              const known = KNOWN_CONTENT_TRANSLATIONS[subVal.trim()];
              if (known && (locale === "en" || locale === "ru")) {
                localizedItem[subKey] = known[locale];
              }
            }
          }

          return localizedItem;
        }
        return item;
      });
    }
  }

  return result as T;
}

export interface CivNameConfig {
  hy: { full: string; short: string };
  en: { full: string; short: string };
  ru: { full: string; short: string };
}

export const CIVILIZATION_NAMES: Record<string, CivNameConfig> = {
  chinese: {
    hy: { full: "Չինական քաղաքակրթություն", short: "Չինական" },
    en: { full: "Chinese Civilization", short: "Chinese" },
    ru: { full: "Китайская цивилизация", short: "Китайская" },
  },
  armenian: {
    hy: { full: "Հայկական քաղաքակրթություն", short: "Հայկական" },
    en: { full: "Armenian Civilization", short: "Armenian" },
    ru: { full: "Армянская цивилизация", short: "Армянская" },
  },
  russian: {
    hy: { full: "Ռուսական քաղաքակրթություն", short: "Ռուսական" },
    en: { full: "Russian Civilization", short: "Russian" },
    ru: { full: "Русская цивилизация", short: "Русская" },
  },
  european: {
    hy: { full: "Եվրոպական քաղաքակրթություն", short: "Եվրոպական" },
    en: { full: "European Civilization", short: "European" },
    ru: { full: "Европейская цивилизация", short: "Европейская" },
  },
  iranian: {
    hy: { full: "Իրանական քաղաքակրթություն", short: "Իրանական" },
    en: { full: "Iranian Civilization", short: "Iranian" },
    ru: { full: "Иранская цивилизация", short: "Иранская" },
  },
  arabic: {
    hy: { full: "Արաբական քաղաքակրթություն", short: "Արաբական" },
    en: { full: "Arabic Civilization", short: "Arabic" },
    ru: { full: "Арабская цивилизация", short: "Арабская" },
  },
  greek: {
    hy: { full: "Հունական քաղաքակրթություն", short: "Հունական" },
    en: { full: "Greek Civilization", short: "Greek" },
    ru: { full: "Греческая цивилизация", short: "Греческая" },
  },
  indian: {
    hy: { full: "Հնդկական քաղաքակրթություն", short: "Հնդկական" },
    en: { full: "Indian Civilization", short: "Indian" },
    ru: { full: "Индийская цивилизация", short: "Индийская" },
  },
};

const CIV_KEY_MAP: Record<string, string> = {
  chn: "chinese",
  chinese: "chinese",
  չինական: "chinese",
  չինաստան: "chinese",
  china: "chinese",

  arm: "armenian",
  armenian: "armenian",
  հայկական: "armenian",
  հայաստան: "armenian",
  armenia: "armenian",

  rus: "russian",
  russian: "russian",
  ռուսական: "russian",
  ռուսաստան: "russian",
  russia: "russian",

  eur: "european",
  european: "european",
  եվրոպական: "european",
  եվրոպա: "european",
  europe: "european",

  irn: "iranian",
  iranian: "iranian",
  իրանական: "iranian",
  իրան: "iranian",
  persian: "iranian",
  iran: "iranian",

  ara: "arabic",
  arabic: "arabic",
  արաբական: "arabic",
  արաբ: "arabic",
  arab: "arabic",

  grk: "greek",
  greek: "greek",
  հունական: "greek",
  հունաստան: "greek",
  greece: "greek",

  ind: "indian",
  indian: "indian",
  հնդկական: "indian",
  հնդկաստան: "indian",
  india: "indian",
};

/**
 * Returns localized civilization name (full or short adjective) for any civilization
 * object, id, slug or string in the active locale.
 */
export function getCivilizationName(
  civOrKey:
    | { id?: string; slug?: string; nameHy?: string; nameEn?: string; translations?: Record<string, any> }
    | string
    | null
    | undefined,
  locale: Locale = "hy",
  short = false
): string {
  if (!civOrKey) return "";

  let key = "";
  if (typeof civOrKey === "string") {
    key = civOrKey.toLowerCase().trim();
  } else {
    // Check if translations map has custom name for this locale
    const trans = civOrKey.translations?.[locale];
    if (trans && typeof trans === "object") {
      const transName = trans.name || trans.nameHy || trans.nameEn;
      if (typeof transName === "string" && transName.trim()) {
        if (short) {
          return transName
            .replace(" քաղաքակրթություն", "")
            .replace(" Civilization", "")
            .replace(" цивилизация", "")
            .trim();
        }
        return transName.trim();
      }
    }
    key = (civOrKey.slug || civOrKey.id || civOrKey.nameEn || civOrKey.nameHy || "").toLowerCase().trim();
  }

  let mappedSlug = CIV_KEY_MAP[key];
  if (!mappedSlug) {
    for (const [k, s] of Object.entries(CIV_KEY_MAP)) {
      if (key.includes(k)) {
        mappedSlug = s;
        break;
      }
    }
  }

  if (mappedSlug && CIVILIZATION_NAMES[mappedSlug]) {
    const conf = CIVILIZATION_NAMES[mappedSlug];
    const locConf = conf[locale] || conf.hy;
    return short ? locConf.short : locConf.full;
  }

  // Fallback for custom or unrecognized civilizations
  if (typeof civOrKey === "object") {
    if (locale === "en" && civOrKey.nameEn) {
      return short ? civOrKey.nameEn.replace(" Civilization", "").trim() : civOrKey.nameEn;
    }
    if (civOrKey.nameHy) {
      return short ? civOrKey.nameHy.replace(" քաղաքակրթություն", "").trim() : civOrKey.nameHy;
    }
  }

  return typeof civOrKey === "string" ? civOrKey : "";
}
