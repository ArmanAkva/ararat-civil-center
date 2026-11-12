import {
  HomePageContent,
  CivilizationsPageContent,
  AboutPageContent,
  DialoguePageContent,
  ForumPageContent,
  FooterContent,
} from "@/types/content";

export const defaultCivilizationsContent: CivilizationsPageContent = {
  badge: "Քաղաքակրթական Համարարչություն",
  title: "8 Քաղաքակրթական Բևեռներ և Մտածողներ",
  description:
    "Ընտրեք 8 ավանդական քաղաքակրթություններից որևէ մեկը՝ ծանոթանալու նրանց գաղափարական կոդին (Core Credo), առաջատար ուղեղային կենտրոններին և մեծագույն մտածողների ժառանգությանը։",
  translations: {
    en: {
      badge: "Civilizational Co-creation",
      title: "8 Civilizational Poles and Thinkers",
      description:
        "Select any of the 8 traditional civilizations to explore their ideological code (Core Credo), leading think tanks, and the intellectual legacy of their greatest thinkers.",
      _isAiTranslated: true,
      _translatedAt: "2026-11-12T00:00:00.000Z",
    },
    ru: {
      badge: "Цивилизационное со-созидание",
      title: "8 Цивилизационных полюсов и мыслителей",
      description:
        "Выберите одну из 8 традиционных цивилизаций, чтобы познакомиться с их идейным кодом (Core Credo), ведущими мозговыми центрами и наследием великих мыслителей.",
      _isAiTranslated: true,
      _translatedAt: "2026-11-12T00:00:00.000Z",
    },
  },
};

export const defaultHomeContent: HomePageContent = {
  heroTitle: "Քաղաքակրթական Երկխոսությունների Արարատյան Ֆորում",
  heroSubtitle: "Քաղաքակրթական Ճգնաժամ, Կոդեր, Արժեքներ և Համարարչություն",
  credo:
    "«Քաղաքակրթական ճգնաժամը պարտադրում է արարող քաղաքակրթությունների երկխոսություն, որի շնորհիվ է հնարավոր ապահովել քաղաքակրթական անցումը և Արդար աշխարհակարգի կառուցումը»։",
  cards: [
    {
      id: "card-civs",
      title: "Քաղաքակրթական Բևեռներ",
      description: "Բացահայտեք 8 ավանդական քաղաքակրթությունների մտավոր կենտրոններն ու առաջատար մտածողներին։",
      link: "/civilizations",
      translations: {
        en: {
          title: "Civilizational Poles",
          description: "Discover the intellectual centers and leading thinkers of the 8 traditional civilizations.",
        },
        ru: {
          title: "Цивилизационные полюса",
          description: "Откройте для себя интеллектуальные центры и ведущих мыслителей 8 традиционных цивилизаций.",
        },
      },
    },
    {
      id: "card-dialogue",
      title: "Երկխոսության Հարթակ",
      description: "Միացեք նախնական քննարկումներին, ուսումնասիրեք գիտական գրադարանը և ներկայացրեք ձեր տեսակետը։",
      link: "/dialogue",
      translations: {
        en: {
          title: "Dialogue Platform",
          description: "Join preparatory discussions, explore the scholarly library, and present your perspective.",
        },
        ru: {
          title: "Платформа диалога",
          description: "Присоединяйтесь к дискуссиям, изучайте научную библиотеку и высказывайте свою точку зрения.",
        },
      },
    },
    {
      id: "card-forum",
      title: "Ֆորում",
      description: "Ծանոթացեք Ֆորումի հայեցակարգային Մանիֆեստին, օրակարգին և դարձեք գործընթացի համահեղինակ։",
      link: "/forum",
      translations: {
        en: {
          title: "Forum",
          description: "Explore the conceptual Manifesto of the Forum, the agenda, and become a co-author of the process.",
        },
        ru: {
          title: "Форум",
          description: "Ознакомьтесь с концептуальным Манифестом Форума, повесткой дня и станьте соавтором процесса.",
        },
      },
    },
  ],
  translations: {
    en: {
      heroTitle: "Ararat Forum of Civilizational Dialogues",
      heroSubtitle: "Civilizational Crisis, Codes, Values and Co-creation",
      credo:
        "\"The civilizational crisis necessitates dialogue among creator civilizations, which alone makes it possible to ensure civilizational transition and build a Just World Order.\"",
      _isAiTranslated: true,
      _translatedAt: "2026-11-12T00:00:00.000Z",
    },
    ru: {
      heroTitle: "Араратский форум цивилизационных диалогов",
      heroSubtitle: "Цивилизационный кризис, коды, ценности и со-созидание",
      credo:
        "«Цивилизационный кризис требует диалога созидательных цивилизаций, благодаря которому возможно обеспечить цивилизационный переход и построение Справедливого миропорядка».",
      _isAiTranslated: true,
      _translatedAt: "2026-11-12T00:00:00.000Z",
    },
  },
};

export const defaultAboutContent: AboutPageContent = {
  headerTitle: "Մեր մասին․ «Արարատյան Քաղաքակրթական Կենտրոն»",
  headerSubtitle: "Հարթակի գաղափարական և ռազմավարական հենքը",
  missionTitle: "Ա․ Առաքելությունը (The Mission)",
  missionP1:
    "«Արարատյան քաղաքակրթական կենտրոն» նախաձեռնությունը ցիվիլիզացիոն կենսիմաստների և կենսընթացների գլոբալ այլընտրանքի համատեղ արարման հարթակ է։ Մեր նպատակն է՝ չհանդուրժելով գլոբալիստական ապամշակութային թելադրանքը, նախագծել Աշխարհի հոգևոր, մշակութային և գիտական նոր ճարտարապետությունը։ Այն հիմնված է քաղաքակրթությունների երկխոսության, համադրման, ներդաշնակման, ստեղծարար համագործակցության և Համարարչության (Co-creation) սկզբունքի վրա։",
  missionP2:
    "Մենք հավատում ենք, որ ժամանակակից անթրոպոլոգիական ճգնաժամը հնարավոր է հաղթահարել միայն ավանդական արժեքների՝ ընտանիքի, հավատքի, հայրենիքի, մշակույթի, արդարության և բացարձակ Ճշմարտության վերահաստատմամբ։",
  civilizationsHeader: "🌐 8 Քաղաքակրթությունների Ուխտագնացություն",
  civilizationsIntro:
    "Արարատյան Կենտրոնը փորձելու է միավորել աշխարհի արարող քաղաքակրթական միտքը կրող առաջատար ուղեղային կենտրոններին, փիլիսոփաներին ու մտածողներին՝",
  whyAraratTitle: "Ինչո՞ւ Հայաստանում և Արարատյան Աշխարհում",
  whyAraratP1:
    "Հայաստանը պարզապես աշխարհագրություն չէ, այլ սրբազան քաղաքակրթական խաչմերուկ։ Լինելով հնագույն քրիստոնյա ազգ՝ Հայությունը դարեր շարունակ օրգանապես համադրել է եվրոպական միտքը, ռուսական մշակութային տիրույթը, Իսլամական Արևելքի խորությունը, ինչպես նաև Հնդկական և Չինական քաղաքակրթությունների տարանցիկ ներկայությունը և դրանց կապն արևմտյան քաղաքակրթության միջև։",
  whyAraratP2:
    "Արարատյան Աշխարհը զերծ է կանխակալ թշնամանքից և հանդիսանում է այն եզակի չեզոք ու հարգալից միջավայրը, որտեղ կարող է կայանալ իրար հետ հակամարտող տարբեր քաղաքակրթությունների միջև երկխոսությունն ու համագործակցությունը, փոխըմբռնումն ու համադրումը՝ արդյունքում ծնվելով ապագա Արդար Աշխարհակարգի հոգևոր վահանը։",
  toolsHeader: "Ի՞նչ է իրենից ներկայացնում հարթակը (Our Tools)",
  toolsIntro: "Մեր կենտրոնը գործում է երկու փոխկապակցված մակարդակներում.",
  incubatorTitle: "Օնլայն Ինկուբատոր",
  incubatorDesc:
    "Այս թվային հարթակը, որտեղ պարբերաբար քննարկվում են գլոբալ հարցադրումներ, համադրվում են մշակութային կոդերը և թվայնացվում է աշխարհի մեծագույն մտածողների գիտական ժառանգությունը։",
  forumToolTitle: "Օֆլայն Ֆորում",
  forumToolDesc:
    "Մշտապես գործող ռազմավարական հարթակ, որի անդրանիկ գլխավոր միջոցառումը նախատեսված է 2027 թվականին Հայաստանում (Գյումրի, Էջմիածին, Երևան)։",
  callToActionTitle: "Միացե՛ք Համարարչությանը",
  callToActionDesc:
    "«Արարատյան Քաղաքակրթական Կենտրոնը» բաց է բոլոր այն գիտնականների, հետազոտողների և ուղեղային կենտրոնների համար, ովքեր պատրաստ են իրենց ինտելեկտուալ ներդրումն ունենալ Քաղաքակրթական երկխոսությունների ու համագործակցության և Արդար Աշխարհակարգի կառուցման սրբազան գործում։",
  callToActionQuote: "«Մենք չենք կանխատեսում ապագան, մենք այն համարարում ենք միասին․․․»",
  translations: {
    en: {
      headerTitle: "About Us: Ararat Civilizational Center",
      headerSubtitle: "Ideological and Strategic Foundation of the Platform",
      missionTitle: "A. The Mission",
      missionP1:
        "The 'Ararat Civilizational Center' initiative is a collaborative platform for co-creating a global alternative of civilizational meanings and life-processes. Our aim is to design the new spiritual, cultural, and scientific architecture of the world based on dialogue, synthesis, harmony, creative partnership, and Co-creation.",
      missionP2:
        "We believe the modern anthropological crisis can only be overcome by reaffirming traditional values: family, faith, homeland, culture, justice, and absolute Truth.",
      civilizationsHeader: "🌐 Pilgrimage of 8 Civilizations",
      civilizationsIntro:
        "The Ararat Center brings together leading think tanks, philosophers, and thinkers carrying the world's creative civilizational thought:",
      whyAraratTitle: "Why in Armenia and the Ararat World?",
      whyAraratP1:
        "Armenia is not merely a geography; it is a sacred civilizational crossroads. As an ancient Christian nation, Armenia has organically synthesized European thought, the Russian cultural sphere, the depth of the Islamic East, as well as transit connections between Indian, Chinese, and Western civilizations.",
      whyAraratP2:
        "The Ararat World is free from prejudice and serves as a unique neutral, respectful environment where dialogue, cooperation, and synthesis between conflicting civilizations can birth the spiritual shield of a future Just World Order.",
      toolsHeader: "What the Platform Represents (Our Tools)",
      toolsIntro: "Our center operates on two interconnected levels:",
      incubatorTitle: "Online Incubator",
      incubatorDesc:
        "A digital space where global issues are discussed, cultural codes are synthesized, and the scholarly heritage of the world's greatest thinkers is digitized.",
      forumToolTitle: "Offline Forum",
      forumToolDesc:
        "A permanent strategic forum whose inaugural plenary summit is planned for 2027 in Armenia (Gyumri, Echmiadzin, Yerevan).",
      callToActionTitle: "Join the Co-creation",
      callToActionDesc:
        "The Ararat Civilizational Center is open to all scholars, researchers, and think tanks ready to contribute intellectually to civilizational dialogue and building a Just World Order.",
      callToActionQuote: "\"We do not predict the future, we co-create it together...\"",
      _isAiTranslated: true,
      _translatedAt: "2026-11-12T00:00:00.000Z",
    },
    ru: {
      headerTitle: "О нас: Араратский Цивилизационный Центр",
      headerSubtitle: "Идейный и стратегический фундамент платформы",
      missionTitle: "А. Миссия (The Mission)",
      missionP1:
        "Инициатива «Араратский цивилизационный центр» — это платформа совместного созидания глобальной альтернативы цивилизационных смыслов и жизненных процессов. Наша цель — спроектировать новую духовную, культурную и научную архитектуру Мира на основе диалога, синтеза, гармонии, творческого сотрудничества и Со-созидания (Co-creation).",
      missionP2:
        "Мы верим, что преодолеть современный антропологический кризис возможно только через утверждение традиционных ценностей: семьи, веры, родины, культуры, справедливости и абсолютной Истины.",
      civilizationsHeader: "🌐 Паломничество 8 Цивилизаций",
      civilizationsIntro:
        "Араратский Центр стремится объединить ведущие мозговые центры, философов и мыслителей, несущих созидательную цивилизационную мысль:",
      whyAraratTitle: "Почему в Армении и Араратском Мире?",
      whyAraratP1:
        "Армения — это не просто география, а священный цивилизационный перекресток. Являясь древней христианской нацией, армянство на протяжении веков органично объединяло европейскую мысль, русское культурное пространство, глубину Исламского Востока, а также транзитное присутствие индийской и китайской цивилизаций.",
      whyAraratP2:
        "Араратский Мир свободен от предвзятой вражды и является той уникальной нейтральной и уважительной средой, где может состояться диалог, взаимопонимание и созидание духовного щита будущего Справедливого Миропорядка.",
      toolsHeader: "Что представляет собой платформа (Наши инструменты)",
      toolsIntro: "Наш центр действует на двух взаимосвязанных уровнях:",
      incubatorTitle: "Онлайн-Инкубатор",
      incubatorDesc:
        "Цифровая платформа, где обсуждаются глобальные вопросы, сопоставляются культурные коды и оцифровывается научное наследие величайших мыслителей.",
      forumToolTitle: "Офлайн-Форум",
      forumToolDesc:
        "Постоянно действующая стратегическая площадка, главное мероприятие которой запланировано на 2027 год в Армении (Гюмри, Эчмиадзин, Ереван).",
      callToActionTitle: "Присоединяйтесь к Со-созиданию",
      callToActionDesc:
        "«Араратский Цивилизационный Центр» открыт для всех ученых, исследователей и аналитических центров, готовых внести свой интеллектуальный вклад в диалог цивилизаций и построение Справедливого Миропорядка.",
      callToActionQuote: "«Мы не предсказываем будущее, мы со-созидаем его вместе...»",
      _isAiTranslated: true,
      _translatedAt: "2026-11-12T00:00:00.000Z",
    },
  },
};

export const defaultDialogueContent: DialoguePageContent = {
  heroBadge: "Արարատյան Կենտրոն · Փիլիսոփայական Ֆորում",
  heroTitle: "Քաղաքակրթական Երկխոսություն & Հարցադրումներ",
  heroDescription:
    "Բաց փիլիսոփայական հարթակ արդի մարտահրավերների, արժեքային համակարգերի և քաղաքակրթական ինքնության շուրջ։ Յուրաքանչյուր հարցադրում ունի իր առանձին քննարկման էջը, որտեղ ներկայացված են փորձագիտական դիրքորոշումները և բաց երկխոսությունը։",
  kpiPublishedLabel: "Հրապարակված Հարցադրումներ",
  kpiActiveLabel: "Ակտիվ Բանավեճեր",
  kpiCommentsLabel: "Գրանցված Կարծիքներ",
  kpiExpertsLabel: "Փորձագիտական Կարծիքներ",
  suggestButtonText: "Առաջարկել Նոր Հարցադրում",
  activeTopic: {
    number: "",
    date: "",
    title: "",
    description: "",
  },
  expertResponses: [],
  publicFeed: [],
  archiveTopics: [],
  translations: {
    en: {
      heroBadge: "Ararat Center · Philosophical Forum",
      heroTitle: "Civilizational Dialogue & Inquiries",
      heroDescription:
        "An open philosophical platform exploring contemporary challenges, value systems, and civilizational identity. Each inquiry has its dedicated discussion page featuring expert perspectives and open dialogue.",
      kpiPublishedLabel: "Published Inquiries",
      kpiActiveLabel: "Active Debates",
      kpiCommentsLabel: "Registered Opinions",
      kpiExpertsLabel: "Expert Insights",
      suggestButtonText: "Propose a New Inquiry",
      activeTopic: {
        number: "",
        date: "",
        title: "",
        description: "",
      },
      expertResponses: [],
      publicFeed: [],
      archiveTopics: [],
      _isAiTranslated: true,
      _translatedAt: "2026-11-12T00:00:00.000Z",
    },
    ru: {
      heroBadge: "Араратский Центр · Философский Форум",
      heroTitle: "Цивилизационный Диалог и Вопрошания",
      heroDescription:
        "Открытая философская платформа для обсуждения современных вызовов, ценностных систем и цивилизационной идентичности. Каждое вопрошание имеет свою страницу обсуждения с экспертными позициями и открытым диалогом.",
      kpiPublishedLabel: "Опубликованные Вопрошания",
      kpiActiveLabel: "Активные Дебаты",
      kpiCommentsLabel: "Зарегистрированные Мнения",
      kpiExpertsLabel: "Экспертные Оценки",
      suggestButtonText: "Предложить Новое Вопрошание",
      activeTopic: {
        number: "",
        date: "",
        title: "",
        description: "",
      },
      expertResponses: [],
      publicFeed: [],
      archiveTopics: [],
      _isAiTranslated: true,
      _translatedAt: "2026-11-12T00:00:00.000Z",
    },
  },
};

export const defaultForumContent: ForumPageContent = {
  datesTitle: "22-24 Հունվարի, 2027",
  locationTitle: "Հայաստան (Գյումրի - Էջմիածին - Երևան)",
  targetDateTime: "2027-01-22T12:00:00",
  countdown: "094 : 01 : 40 : 25",
  manifestoTitle: "Արարատյան Մանիֆեստ",
  manifestoWhat:
    "Սա նոր ձևաչափ է, որը նպատակ ունի վերականգնել կորսված երկխոսությունը տարբեր ավանդույթների միջև։",
  messages: [
    {
      id: 1,
      title: "Ուղերձ 1",
      content: "Քաղաքակրթական ժամանակակից ճգնաժամ․ Հաղթահարման ուղիները։",
    },
    {
      id: 2,
      title: "Ուղերձ 2",
      content: "Քաղաքակրթական կոդեր և արժեքներ․ համադրում։",
    },
    {
      id: 3,
      title: "Ուղերձ 3",
      content: "Քաղաքակրթական ստեղծարար համագործակցություն՝ Համարարչություն։",
    },
  ],
  agenda: [
    {
      id: "day-1",
      day: "ՕՐ 1. ԳՅՈՒՄՐԻ",
      title: "«Black Fortress» (Սև բերդ)",
      description: "Բացման արարողություն և առաջին պանելային քննարկում։",
    },
    {
      id: "day-2",
      day: "ՕՐ 2. ԷՋՄԻԱԾԻՆ",
      title: "Մայր Աթոռ Սուրբ Էջմիածնի Մատենադարան",
      description: "Հոգևոր ժառանգություն և քաղաքակրթական կոդեր։",
    },
    {
      id: "day-3",
      day: "ՕՐ 3. ԵՐԵՎԱՆ",
      title: "Գիտությունների Ազգային Ակադեմիա",
      description: "Ակադեմիական ամփոփում և Հռչակագրի ընդունում։",
    },
  ],
  consensusTitle: "Կոնսենսուսի Ցուցիչ (Consensus Dashboard)",
  consensusSubtitle: "Արարատյան Հռչակագրի լեգիտիմության կենդանի ցուցիչ",
  consensusPercent: 78,
  organizerOwner: {
    id: "org-owner-1",
    name: "Դոկտ. Արման Հովհաննիսյան",
    role: "Ֆորումի Գլխավոր Համակարգող / Ղեկավար",
    affiliation: "Արարատյան Քաղաքակրթական Կենտրոն / ԵՊՀ",
    isOwner: true,
    email: "arman@ararat-forum.org",
    bio: "Համակարգում է միջքաղաքակրթական երկխոսության նախաձեռնությունները, պատասխանատու է Արարատյան Ֆորումի ռազմավարական տեսլականի և կազմկոմիտեի գործունեության համար։",
  },
  organizers: [
    {
      id: "org-owner-1",
      name: "Դոկտ. Արման Հովհաննիսյան",
      role: "Ֆորումի Գլխավոր Համակարգող / Ղեկավար",
      affiliation: "Արարատյան Կենտրոն / ԵՊՀ",
      isOwner: true,
      email: "arman@ararat-forum.org",
      bio: "Ռազմավարական համակարգում, միջազգային կապեր և նախագահություն։",
    },
    {
      id: "org-2",
      name: "Դոկտ. Աննա Սարգսյան",
      role: "Գիտական Քարտուղար",
      affiliation: "Մեսրոպ Մաշտոցի անվան Մատենադարան",
      isOwner: false,
      email: "sargsyan.anna@matenadaran.am",
      bio: "Համակարգում է ակադեմիական պանելները, Մանիֆեստի խմբագրական խորհուրդը և հարցադրումների վերլուծությունը։",
    },
    {
      id: "org-3",
      name: "Պրոֆ. Լի Վեյ (Prof. Li Wei)",
      role: "Միջազգային Հանձնախմբի Ղեկավար",
      affiliation: "Չինաստանի Հասարակական Գիտությունների Ակադեմիա (CASS)",
      isOwner: false,
      email: "li.wei@cass-thinktank.cn",
      bio: "Միջազգային քաղաքակրթական կենտրոնների և պատվիրակությունների համակարգող։",
    },
    {
      id: "org-4",
      name: "Վահան Մարտիրոսյան",
      role: "Գործառնական & Լոգիստիկայի Համակարգող",
      affiliation: "Գյումրիի Տեխնոլոգիական Կենտրոն",
      isOwner: false,
      email: "vahan.m@gyumri-tech.am",
      bio: "Պատասխանատու է միջոցառումների անցկացման ենթակառուցվածքների, տրանսֆերների և հյուրընկալության համար։",
    },
    {
      id: "org-5",
      name: "Սոֆյա Կարապետյան",
      role: "Հանրային Կապերի և Թվային Պլատֆորմի Ղեկավար",
      affiliation: "Արարատյան Մեդիա Հաբ",
      isOwner: false,
      email: "sofia.k@ararat-forum.org",
      bio: "Համակարգում է թվային քննարկումների հարթակը, քվեարկությունները և միջազգային լուսաբանումը։",
    },
  ],
  suggestions: [
    {
      id: "sugg-1",
      type: "manifesto",
      targetTitle: "Արարատյան Մանիֆեստ",
      authorName: "Դոկտոր Ա. Գրիգորյան",
      authorRole: "scholar",
      authorAffiliation: "ԵՊՀ Փիլիսոփայության ֆակուլտետ",
      title: "Համարարչության հասկացության հստակեցում",
      content: "Առաջարկում եմ Մանիֆեստի տեքստում «Համարարչություն» հասկացությունը սահմանել որպես հոգևոր ավանդույթների և բարձր տեխնոլոգիաների ներդաշնակեցման քաղաքակրթական հրամայական։",
      category: "amendment",
      status: "reviewed",
      likesCount: 18,
      likedBy: [],
      createdAt: "2026-10-18T11:20:00.000Z",
      replies: [
        {
          id: "rep-1-1",
          authorName: "Դոկտ. Աննա Սարգսյան",
          authorRole: "admin",
          content: "Շնորհակալություն, շատ կարևոր առաջարկ է։ Խմբագրական հանձնախումբը կներառի Մանիֆեստի 2-րդ բաժնում։",
          createdAt: "2026-10-18T14:30:00.000Z",
        },
      ],
    },
    {
      id: "sugg-2",
      type: "message",
      targetId: 1,
      targetTitle: "Ուղերձ 1. Քաղաքակրթական ժամանակակից ճգնաժամ",
      authorName: "Գարեգին Պետրոսյան",
      authorRole: "scholar",
      authorAffiliation: "ՀՀ ԳԱԱ Պատմության Ինստիտուտ",
      title: "Արժեքային անվտանգության թեման",
      content: "Առաջին ուղերձի շեշտադրումներում պետք է ընդգծել նաև մշակութային ժառանգության պաշտպանությունը թվային հարթակներում։",
      category: "suggestion",
      status: "approved",
      likesCount: 12,
      likedBy: [],
      createdAt: "2026-10-19T09:15:00.000Z",
    },
    {
      id: "sugg-3",
      type: "date_location",
      targetTitle: "Ժամկետներ & Գյումրիի Հատված",
      authorName: "Մարիամ Բաղդասարյան",
      authorRole: "member",
      authorAffiliation: "Մասնակից, Գյումրի",
      title: "Տրանսպորտային համակարգում Գյումրի-Երևան ուղղությամբ",
      content: "Խնդրում ենք ապահովել առավոտյան հատուկ էքսպրես երթուղի Սև Բերդի համալիրի համար, որպեսզի Երևանից ժամանող հետազոտողները ժամանակին հասնեն բացմանը։",
      category: "suggestion",
      status: "implemented",
      likesCount: 24,
      likedBy: [],
      createdAt: "2026-10-19T16:40:00.000Z",
    },
    {
      id: "sugg-4",
      type: "agenda",
      targetId: "day-2",
      targetTitle: "ՕՐ 2. ԷՋՄԻԱԾԻՆ",
      authorName: "Հայր Կորյուն",
      authorRole: "scholar",
      authorAffiliation: "Մայր Աթոռ Սուրբ Էջմիածին",
      title: "Հին ձեռագրերի ցուցադրություն",
      content: "Նախատեսվում է հատուկ փակ ցուցադրություն Մատենադարանի ձեռագրական հավաքածուից՝ նվիրված միջքաղաքակրթական դիվանագիտության պատմությանը։",
      category: "comment",
      status: "approved",
      likesCount: 31,
      likedBy: [],
      createdAt: "2026-10-20T08:00:00.000Z",
    },
  ],
  translations: {
    en: {
      datesTitle: "January 22-24, 2027",
      locationTitle: "Armenia (Gyumri - Echmiadzin - Yerevan)",
      manifestoTitle: "The Ararat Manifesto",
      manifestoWhat:
        "This is a new format aimed at restoring the lost dialogue between diverse civilizational traditions.",
      messages: [
        {
          id: 1,
          title: "Message 1",
          content: "Contemporary civilizational crisis: Pathways to overcoming.",
        },
        {
          id: 2,
          title: "Message 2",
          content: "Civilizational codes and values: Harmonization and synthesis.",
        },
        {
          id: 3,
          title: "Message 3",
          content: "Creative civilizational collaboration: Co-creation (Hamarrarutyun).",
        },
      ],
      agenda: [
        {
          id: "day-1",
          day: "DAY 1. GYUMRI",
          title: "«Black Fortress» (Sev Berd)",
          description: "Opening ceremony and first keynote panel discussion.",
        },
        {
          id: "day-2",
          day: "DAY 2. ECHMIADZIN",
          title: "Mother See of Holy Echmiadzin Matenadaran",
          description: "Spiritual heritage and civilizational identity codes.",
        },
        {
          id: "day-3",
          day: "DAY 3. YEREVAN",
          title: "National Academy of Sciences",
          description: "Academic synthesis and official adoption of the Ararat Declaration.",
        },
      ],
      consensusTitle: "Consensus Dashboard",
      consensusSubtitle: "Live legitimacy indicator of the Ararat Declaration",
      _isAiTranslated: true,
      _translatedAt: "2026-11-12T00:00:00.000Z",
    },
    ru: {
      datesTitle: "22-24 Января, 2027",
      locationTitle: "Армения (Гюмри - Эчмиадзин - Ереван)",
      manifestoTitle: "Араратский Манифест",
      manifestoWhat:
        "Это новый формат, нацеленный на восстановление утраченного диалога между различными цивилизационными традициями.",
      messages: [
        {
          id: 1,
          title: "Послание 1",
          content: "Современный цивилизационный кризис: Пути преодоления.",
        },
        {
          id: 2,
          title: "Послание 2",
          content: "Цивилизационные коды и ценности: Сопоставление и синтез.",
        },
        {
          id: 3,
          title: "Послание 3",
          content: "Творческое цивилизационное соработничество: Со-созидание.",
        },
      ],
      agenda: [
        {
          id: "day-1",
          day: "ДЕНЬ 1. ГЮМРИ",
          title: "«Черная Крепость» (Сев Берд)",
          description: "Церемония открытия и первая панельная дискуссия.",
        },
        {
          id: "day-2",
          day: "ДЕНЬ 2. ЭЧМИАДЗИН",
          title: "Матенадаран Первопрестольного Святого Эчмиадзина",
          description: "Духовное наследие и цивилизационные коды.",
        },
        {
          id: "day-3",
          day: "ДЕНЬ 3. ЕРЕВАН",
          title: "Национальная Академия Наук",
          description: "Академическое подведение итогов и принятие Араратской Декларации.",
        },
      ],
      consensusTitle: "Показатель Консенсуса (Consensus Dashboard)",
      consensusSubtitle: "Живой индикатор легитимности Араратской Декларации",
      _isAiTranslated: true,
      _translatedAt: "2026-11-12T00:00:00.000Z",
    },
  },
};

export const defaultFooterContent: FooterContent = {
  callToActionEyebrow: "✧ ՀԱՄԱՐԱՐՉԱԿԱՆ ԿՈՉ ✧",
  callToActionTitle: "Միացե՛ք Համարարչությանը",
  callToActionDesc:
    "«Արարատյան Ֆորումը» բաց է բոլոր նրանց համար, ովքեր հավատում են մարդկային մտքի ստեղծարար ներուժին և քաղաքակրթությունների խաղաղ համակեցությանը։ Դարձե՛ք մեր ցանցի մասնակիցը։",
  callToActionQuote: "«Մենք չենք կանխատեսում ապագան, մենք այն համարարում ենք միասին․․․»",
  callToActionBtn1: "💬 Միանալ Քննարկումներին",
  callToActionBtn2: "🏛️ Դիտել Քաղաքակրթությունները",
  brandName: "ԱՐԱՐԱՏՅԱՆ ՖՈՐՈՒՄ",
  brandTagline: "Քաղաքակրթական երկխոսությունների, գիտական հետազոտությունների և համարարչության բազմաբևեռ միջավայր։",
  navTitle: "Հիմնական Բաժիններ",
  valuesTitle: "Արժեհամակարգ",
  valueItem1: "✦ Քաղաքակրթական Ինքնիշխանություն",
  valueItem2: "✦ Բազմաբևեռ Ներդաշնակություն",
  valueItem3: "✦ Հոգևոր-Գիտական Սինթեզ",
  valueItem4: "✦ Համարարչության Տեսլական",
  copyrightText: "© 2026 Արարատյան Ֆորում / Քաղաքակրթական Կենտրոն: Բոլոր իրավունքները պաշտպանված են:",
  linkContactText: "Կոնտակտներ",
  linkCharterText: "Կանոնադրություն",
  translations: {
    en: {
      callToActionEyebrow: "✧ CALL TO CO-CREATION ✧",
      callToActionTitle: "Join the Co-Creation",
      callToActionDesc:
        "The «Ararat Forum» is open to all who believe in the creative potential of the human mind and peaceful coexistence of civilizations. Become part of our network.",
      callToActionQuote: "“We do not predict the future; we co-create it together...”",
      callToActionBtn1: "💬 Join the Discussions",
      callToActionBtn2: "🏛️ Explore Civilizations",
      brandName: "ARARAT FORUM",
      brandTagline:
        "A multipolar environment for civilizational dialogues, scientific research, and co-creation.",
      navTitle: "Main Sections",
      valuesTitle: "Core Values",
      valueItem1: "✦ Civilizational Sovereignty",
      valueItem2: "✦ Multipolar Harmony",
      valueItem3: "✦ Spiritual-Scientific Synthesis",
      valueItem4: "✦ Vision of Co-Creation",
      copyrightText:
        "© 2026 Ararat Forum / Civilizational Center. All rights reserved.",
      linkContactText: "Contacts",
      linkCharterText: "Charter",
      _isAiTranslated: true,
      _translatedAt: "2026-11-12T00:00:00.000Z",
    },
    ru: {
      callToActionEyebrow: "✧ ПРИЗЫВ К СО-СОЗИДАНИЮ ✧",
      callToActionTitle: "Присоединяйтесь к Со-созиданию",
      callToActionDesc:
        "«Араратский Форум» открыт для всех, кто верит в созидательный потенциал человеческого разума и мирное сосуществование цивилизаций. Станьте частью нашей сети.",
      callToActionQuote: "«Мы не предсказываем будущее, мы со-созидаем его вместе...»",
      callToActionBtn1: "💬 Присоединиться к дискуссиям",
      callToActionBtn2: "🏛️ Обзор Цивилизаций",
      brandName: "АРАРАТСКИЙ ФОРУМ",
      brandTagline:
        "Многополярная среда для цивилизационных диалогов, научных исследований и со-созидания.",
      navTitle: "Основные Разделы",
      valuesTitle: "Система Ценностей",
      valueItem1: "✦ Цивилизационный Суверенитет",
      valueItem2: "✦ Многополярная Гармония",
      valueItem3: "✦ Духовно-Научный Синтез",
      valueItem4: "✦ Видение Со-созидания",
      copyrightText:
        "© 2026 Араратский Форум / Цивилизационный Центр. Все права защищены.",
      linkContactText: "Контакты",
      linkCharterText: "Устав",
      _isAiTranslated: true,
      _translatedAt: "2026-11-12T00:00:00.000Z",
    },
  },
};
