export interface Publication {
  id?: string;
  civId?: string;
  title: string;
  year?: string;
  type: "PDF" | "Մենագրություն" | "Հոդված" | "Զեկույց" | string;
  description?: string;
  pages?: number;
  downloadUrl?: string;
  fileName?: string;
  fileSizeBytes?: number;
  authorIds?: string[];
  centerIds?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ThinkTank {
  id: string;
  name: string;
  originalName: string;
  city: string;
  country: string;
  foundedYear?: string;
  description: string;
  focusAreas: string[];
  website?: string;
  publications?: Publication[];
  publicationIds?: string[];
  authors?: Thinker[];
  authorIds?: string[];
}

export interface Thinker {
  id: string;
  name: string;
  nameOriginal?: string;
  title: string;
  bio: string;
  quote?: string;
  avatarBg?: string;
  publications: Publication[];
  publicationIds?: string[];
}

export interface Civilization {
  id: string;
  slug: string;
  nameHy: string;
  nameEn: string;
  symbol: string;
  badge: string;
  tagline: string;
  credo: string;
  overview: string;
  centers: ThinkTank[];
  authors: Thinker[];
  publications?: Publication[];
}

export const civilizationsData: Civilization[] = [
  {
    id: "chn",
    slug: "chinese",
    nameHy: "Չինական քաղաքակրթություն",
    nameEn: "Chinese Civilization",
    symbol: "☯",
    badge: "Համակեցության Օնտոլոգիա",
    tagline: "«Տյանսյա» համակարգ և համակեցության օնտոլոգիա",
    credo: "«Տյանսյա» (Ամեն ինչ երկնքի տակ) համակարգը և համակեցության օնտոլոգիան․ աշխարհակարգ՝ հիմնված ներդաշնակության, փոխլրացման և համընդհանուր բարոյականության վրա, որտեղ հակամարտությունը փոխարինվում է մշակութային համակեցությամբ և հավերժական խաղաղությամբ։",
    overview: "Չինական քաղաքակրթական միտքը հիմնված է հազարամյակների կոնֆուցիական, դաոսական և նեոկոնֆուցիական ավանդույթների վրա։ Ժամանակակից աշխարհում այն առաջարկում է ոչ թե հեգեմոնիկ, այլ ցանցային և ներառական աշխարհակարգի նոր տեսլական։",
    centers: [
      {
        id: "cass",
        name: "Չինաստանի Հասարակական Գիտությունների Ակադեմիա (CASS)",
        originalName: "Chinese Academy of Social Sciences (中国社会科学院)",
        city: "Պեկին",
        country: "Չինաստան",
        foundedYear: "1977",
        description: "Չինաստանի առաջատար ակադեմիական և քաղաքական վերլուծական կենտրոնը, որտեղ մշակվում են փիլիսոփայական, քաղաքակրթական և ռազմավարական գլոբալ հայեցակարգերը։",
        focusAreas: ["Փիլիսոփայություն", "Տյանսյա տեսություն", "Համաշխարհային քաղաքականություն", "Քաղաքակրթական համեմատական հետազոտություններ"],
        website: "http://cass.cn",
        publicationIds: ["pub-chn-tianxia", "pub-chn-first-philosophy", "pub-chn-confucian-thought"]
      },
      {
        id: "ipis-chn",
        name: "Միջազգային Հարաբերությունների և Ռազմավարական Հետազոտությունների Ինստիտուտ",
        originalName: "Institute of International and Strategic Studies (Peking University)",
        city: "Պեկին",
        country: "Չինաստան",
        foundedYear: "2013",
        description: "Պեկինի համալսարանի գիտահետազոտական կենտրոն, որն ուսումնասիրում է բազմաբևեռ աշխարհակարգի ձևավորումն ու քաղաքակրթական հավասարակշռությունը։",
        focusAreas: ["Ռազմավարական անվտանգություն", "Արևելք-Արևմուտք երկխոսություն", "Եվրասիական ինտեգրացիա"],
        website: "http://iiss.pku.edu.cn",
        publicationIds: ["pub-chn-global-order", "pub-chn-spiritual-humanism"]
      },
      {
        id: "caus",
        name: "Չինաստանի Միջազգային Հարաբերությունների Ակադեմիա (CICIR)",
        originalName: "China Institutes of Contemporary International Relations",
        city: "Պեկին",
        country: "Չինաստան",
        foundedYear: "1980",
        description: "Չինաստանի ամենահեղինակավոր ուղեղային կենտրոններից մեկը, որը մասնագիտացած է գլոբալ կառավարման և քաղաքակրթական դիվանագիտության մեջ։",
        focusAreas: ["Գլոբալ կառավարում", "Քաղաքակրթական ռազմավարություն", "Ասիական անվտանգություն"],
        website: "http://cicir.ac.cn",
        publicationIds: ["pub-chn-global-order"]
      },
      {
        id: "mcc",
        name: "Համաշխարհայնացման Կենտրոն (CCG)",
        originalName: "Center for China and Globalization",
        city: "Պեկին / Շանհայ",
        country: "Չինաստան",
        foundedYear: "2008",
        description: "Անկախ վերլուծական կենտրոն, որը կամրջում է չինական ակադեմիական միտքը միջազգային հարթակների հետ։",
        focusAreas: ["Գլոբալիզացիայի ապագա", "Մշակութային երկխոսություն", "Տնտեսական դիվանագիտություն"],
        website: "http://ccg.org.cn",
        publicationIds: ["pub-chn-confucian-thought"]
      }
    ],
    authors: [
      {
        id: "zhao-tingyang",
        name: "Ժաո Տինյան (Zhao Tingyang)",
        nameOriginal: "赵汀阳",
        title: "Փիլիսոփա, CASS-ի ակադեմիկոս",
        bio: "Համաշխարհային ճանաչում ունեցող ժամանակակից չին փիլիսոփա, «Տյանսյա» (Ամեն ինչ երկնքի տակ) հայեցակարգի ժամանակակից վերաիմաստավորողն ու գլխավոր տեսաբանը։ Նրա աշխատությունները վերափոխում են միջազգային հարաբերությունների փիլիսոփայությունը։",
        quote: "«Տյանսյա համակարգը ոչ թե ազգային պետությունների կոնգլոմերատ է, այլ ամբողջական աշխարհը որպես մեկ ներդաշնակ տիեզերական տուն ընկալելու արվեստ։»",
        publicationIds: ["pub-chn-tianxia", "pub-chn-first-philosophy", "pub-chn-global-order"],
        publications: [
          {
            id: "pub-chn-tianxia",
            title: "«Տյանսյա համակարգը. Աշխարհակարգի փիլիսոփայություն»",
            year: "2016",
            type: "PDF",
            description: "Հիմնարար աշխատություն աշխարհի միասնական քաղաքական և բարոյական կառուցվածքի մասին։",
            pages: 284
          },
          {
            id: "pub-chn-first-philosophy",
            title: "«Առաջին փիլիսոփայության վերաիմաստավորումը»",
            year: "2019",
            type: "PDF",
            description: "Գոյաբանական հետազոտություն համակեցության և փոխլրացման սկզբունքների վերաբերյալ։",
            pages: 196
          },
          {
            id: "pub-chn-global-order",
            title: "«Համաշխարհային քաղաքականության նոր դարաշրջանը»",
            year: "2021",
            type: "Զեկույց",
            description: "Հատուկ զեկույց բազմաբևեռ աշխարհակարգի էթիկական հիմքերի մասին։",
            pages: 64
          }
        ]
      },
      {
        id: "tu-weiming",
        name: "Դու Վեյմին (Tu Weiming)",
        nameOriginal: "杜维明",
        title: "Նեոկոնֆուցիականության առաջատար փիլիսոփա, Հարվարդի և Պեկինի համալսարանների պրոֆեսոր",
        bio: "Ժամանակակից նեոկոնֆուցիականության առաջամարտիկներից, ով ուսումնասիրում է հոգևոր հումանիզմը և քաղաքակրթական երկխոսության էկոլոգիան արդի աշխարհում։",
        quote: "«Իսկական մարդասիրությունը սկսվում է ինքնակատարելագործումից և տարածվում տիեզերական ներդաշնակության վրա։»",
        publicationIds: ["pub-chn-confucian-thought", "pub-chn-spiritual-humanism"],
        publications: [
          {
            id: "pub-chn-confucian-thought",
            title: "«Կոնֆուցիական միտք. Ինքնակայացումը որպես ստեղծարար վերափոխում»",
            year: "2015",
            type: "PDF",
            description: "Անհատի և հասարակության հոգևոր զարգացման կոնֆուցիական մոդելը։",
            pages: 220
          },
          {
            id: "pub-chn-spiritual-humanism",
            title: "«Հոգևոր հումանիզմ և գլոբալ էթիկա»",
            year: "2018",
            type: "Մենագրություն",
            description: "Երկխոսություն արևմտյան և արևելյան հոգևոր ավանդույթների միջև։",
            pages: 180
          }
        ]
      }
    ],
    publications: [
      {
        id: "pub-chn-tianxia",
        civId: "chn",
        title: "«Տյանսյա համակարգը. Աշխարհակարգի փիլիսոփայություն»",
        year: "2016",
        type: "PDF",
        description: "Հիմնարար աշխատություն աշխարհի միասնական քաղաքական և բարոյական կառուցվածքի մասին։",
        pages: 284,
        authorIds: ["zhao-tingyang"],
        centerIds: ["cass"]
      },
      {
        id: "pub-chn-first-philosophy",
        civId: "chn",
        title: "«Առաջին փիլիսոփայության վերաիմաստավորումը»",
        year: "2019",
        type: "PDF",
        description: "Գոյաբանական հետազոտություն համակեցության և փոխլրացման սկզբունքների վերաբերյալ։",
        pages: 196,
        authorIds: ["zhao-tingyang"],
        centerIds: ["cass"]
      },
      {
        id: "pub-chn-global-order",
        civId: "chn",
        title: "«Համաշխարհային քաղաքականության նոր դարաշրջանը»",
        year: "2021",
        type: "Զեկույց",
        description: "Հատուկ զեկույց բազմաբևեռ աշխարհակարգի էթիկական հիմքերի մասին։",
        pages: 64,
        authorIds: ["zhao-tingyang"],
        centerIds: ["caus", "ipis-chn"]
      },
      {
        id: "pub-chn-confucian-thought",
        civId: "chn",
        title: "«Կոնֆուցիական միտք. Ինքնակայացումը որպես ստեղծարար վերափոխում»",
        year: "2015",
        type: "PDF",
        description: "Անհատի և հասարակության հոգևոր զարգացման կոնֆուցիական մոդելը։",
        pages: 220,
        authorIds: ["tu-weiming"],
        centerIds: ["cass", "mcc"]
      },
      {
        id: "pub-chn-spiritual-humanism",
        civId: "chn",
        title: "«Հոգևոր հումանիզմ և գլոբալ էթիկա»",
        year: "2018",
        type: "Մենագրություն",
        description: "Երկխոսություն արևմտյան և արևելյան հոգևոր ավանդույթների միջև։",
        pages: 180,
        authorIds: ["tu-weiming"],
        centerIds: ["ipis-chn"]
      }
    ]
  },
  {
    id: "arm",
    slug: "armenian",
    nameHy: "Հայկական քաղաքակրթություն",
    nameEn: "Armenian Civilization",
    symbol: "☩",
    badge: "Հոգևոր Էակ և Համարարչություն",
    tagline: "Հոգևոր-մշակութային ինքնություն և արարչագործություն",
    credo: "«Հայկական քաղաքակրթական կոդը՝ հոգևոր-մշակութային ինքնություն, սրբազան տարածության պահպանություն և արարչագործություն։ Հոգևոր Էակի և Արդար պետության ներդաշնակում՝ որպես աշխարհի քաղաքակրթական խաչմերուկ, կամուրջ և համարարչական սրբավայր։»",
    overview: "Հայկական լեռնաշխարհը՝ որպես մարդկության վերածննդի և հոգևոր արարման օրրան, դարեր շարունակ միավորել է քաղաքակրթությունների մտավոր գանձերը։ Հայկական ավանդույթը շեշտադրում է ճշմարտության որոնումը, սրբազան ազատությունը և Համարարչությունը։",
    centers: [
      {
        id: "matenadaran",
        name: "Մեսրոպ Մաշտոցի անվան Մատենադարան",
        originalName: "Mesrop Mashtots Institute of Ancient Manuscripts",
        city: "Երևան",
        country: "Հայաստան",
        foundedYear: "1959",
        description: "Հին ձեռագրերի և պատմական փաստաթղթերի համաշխարհային նշանակության գիտահետազոտական ինստիտուտ, քաղաքակրթական հիշողության գլխավոր գանձարան։",
        focusAreas: ["Ձեռագրագիտություն", "Աստվածաբանություն", "Արևելագիտություն", "Միջնադարյան փիլիսոփայություն"],
        website: "https://matenadaran.am",
        publications: [
          {
            title: "Հայկական Միջնադարյան Ձեռագրերի Գանձարան և Քաղաքակրթական Ժառանգություն",
            year: "2024",
            type: "Մենագրություն",
            pages: 380,
            description: "Հայոց ձեռագրական ֆոնդի, մանրանկարչության դպրոցների և փիլիսոփայական տեքստերի համապարփակ հետազոտություն:"
          },
          {
            title: "Անտիկ և Արևելյան Փիլիսոփայական Թարգմանությունները Մատենադարանում",
            year: "2023",
            type: "Հոդված",
            pages: 45,
            description: "Արիստոտելի, Պլատոնի և Փիլոն Եբրայեցու հայերեն թարգմանությունների համեմատական վերլուծություն:"
          }
        ],
        authorIds: ["mesrop-mashtots", "grigor-tatevatsi"],
        publicationIds: ["pub-matenadaran-manuscripts", "pub-matenadaran-translations", "pub-narekatsi-tragedy"]
      },
      {
        id: "ararat-center",
        name: "Քաղաքակրթական Համագործակցության Արարատյան Կենտրոն",
        originalName: "Araratian Center for Civilizational Cooperation",
        city: "Երևան / Գյումրի",
        country: "Հայաստան",
        foundedYear: "2024",
        description: "Գլոբալ ցիվիլիզացիոն երկխոսությունների, ավանդական արժեքների վերաիմաստավորման և Համարարչության հայեցակարգային հարթակ։",
        focusAreas: ["Քաղաքակրթական կոդեր", "Անթրոպոլոգիական ճգնաժամ", "Արդար աշխարհակարգ", "Համարարչություն"],
        website: "https://ararat-forum.org",
        publications: [
          {
            title: "Արարատյան Դոկտրին. Քաղաքակրթական Կոդեր և Համարարչական Աշխարհակարգ",
            year: "2025",
            type: "Զեկույց",
            pages: 115,
            description: "Անթրոպոլոգիական ճգնաժամի հաղթահարման, բազմաբևեռ արդարության և հոգևոր-քաղաքակրթական ներդաշնակման հայեցակարգ:"
          }
        ],
        authorIds: ["vardan-grigoryan"],
        publicationIds: ["pub-araratian-doctrine", "pub-islam-mosaic", "pub-book-path"]
      },
      {
        id: "nas-ra",
        name: "ՀՀ Գիտությունների Ազգային Ակադեմիայի Փիլիսոփայության Ինստիտուտ",
        originalName: "Institute of Philosophy, Sociology and Law of NAS RA",
        city: "Երևան",
        country: "Հայաստան",
        foundedYear: "1969",
        description: "Հայոց փիլիսոփայական մտքի, ազգային ինքնության և սոցիալական արդարության հարցերով զբաղվող գլխավոր ակադեմիական օղակը։",
        focusAreas: ["Հայ փիլիսոփայություն", "Իրավունքի տեսություն", "Սոցիալական էթիկա"],
        website: "https://sci.am",
        authorIds: ["grigor-tatevatsi", "naregatsi"],
        publicationIds: ["pub-matenadaran-translations", "pub-narekatsi-tragedy"]
      }
    ],
    authors: [
      {
        id: "vardan-grigoryan",
        name: "Վարդան Գրիգորյան (Vartan Gregorian)",
        nameOriginal: "Vartan Gregorian",
        title: "Պատմաբան, փիլիսոփա, Կարնեգի հիմնադրամի նախագահ",
        bio: "Համաշխարհային հումանիտար մտքի ականավոր գործիչ, պատմաբան և մանկավարժ։ Իր աշխատություններում հետազոտել է իսլամական և արևմտյան մշակույթների հատման կետերը և կրթության փրկարար դերը։",
        quote: "«Կրթությունն ու գիտելիքը լույս են, որը ցրում է անտարբերության և թշնամանքի խավարը քաղաքակրթությունների միջև։»",
        publications: [
          {
            title: "«Իսլամ. Մոզաիկա, ոչ թե մոնոլիտ»",
            year: "2003",
            type: "PDF",
            description: "Քաղաքակրթական բազմազանության և հանդուրժողականության հիմնարար հետազոտություն։",
            pages: 192
          },
          {
            title: "«Գրքերի ճանապարհը. Ինքնակենսագրություն»",
            year: "2005",
            type: "Մենագրություն",
            description: "Հիշողություններ և խորհրդածություններ մշակույթի, գրադարանների և գիտության դերի մասին։",
            pages: 350
          }
        ]
      },
      {
        id: "mesrop-mashtots",
        name: "Մեսրոպ Մաշտոց (Mesrop Mashtots)",
        nameOriginal: "Mesrop Mashtots",
        title: "Հայ գրերի ստեղծող, առաջին ուսուցիչ և աստվածաբան",
        bio: "Հայոց այբուբենի հիմնադիր, ով մեկնարկեց հայկական Ոսկեդարյան թարգմանչական շարժումը և քաղաքակրթական ինքնության հավերժացումը։",
        quote: "«Ճանաչել զիմաստութիւն և զխրատ, իմանալ զբանս հանճարոյ։»",
        publications: []
      },
      {
        id: "grigor-tatevatsi",
        name: "Գրիգոր Տաթևացի (Grigor Tatevatsi)",
        nameOriginal: "Grigor Tatevatsi",
        title: "Միջնադարյան աստվածաբան, Տաթևի համալսարանի ռեկտոր",
        bio: "Միջնադարյան Հայաստանի մեծագույն իմաստասեր, հայրաբան և մանկավարժ, «Գիրք Հարցմանց» մոնումենտալ աշխատության հեղինակ։",
        quote: "«Իմաստությունն առանց առաքինության նման է առանց յուղի լամպի։»",
        publications: []
      },
      {
        id: "naregatsi",
        name: "Սուրբ Գրիգոր Նարեկացի (Ժառանգության վերլուծություն)",
        nameOriginal: "Grigor Narekatsi",
        title: "Տիեզերական եկեղեցու վարդապետ, միստիկ փիլիսոփա",
        bio: "Հայ միջնադարյան վերածննդի գագաթնակետը, ում աղոթամատյանը մարդու և Աստծո երկխոսության բարձրագույն անթրոպոլոգիական վավերացումն է։",
        quote: "«Ի խորոց սրտի խօսք ընդ Աստուծոյ․ մարդը որպես արարչության հոգևոր պսակ։»",
        publications: [
          {
            title: "«Մատյան Ողբերգության» (Գիտական վերլուծություն)",
            year: "1003",
            type: "PDF",
            description: "Մարդաբանական և աստվածաբանական անզուգական ձեռագիր ժառանգություն։",
            pages: 420
          }
        ]
      }
    ],
    publications: [
      {
        id: "pub-araratian-doctrine",
        title: "Արարատյան Դոկտրին. Քաղաքակրթական Կոդեր և Համարարչական Աշխարհակարգ",
        year: "2025",
        type: "Զեկույց",
        pages: 115,
        downloadUrl: "",
        description: "Անթրոպոլոգիական ճգնաժամի հաղթահարման, բազմաբևեռ արդարության և հոգևոր-քաղաքակրթական ներդաշնակման հայեցակարգ:",
        authorIds: ["vardan-grigoryan"],
        centerIds: ["ararat-center"]
      },
      {
        id: "pub-matenadaran-manuscripts",
        title: "Հայկական Ձեռագրական Ժառանգությունը և Իմաստասիրական Ավանդույթը",
        year: "2024",
        type: "Մենագրություն",
        pages: 380,
        downloadUrl: "",
        description: "Հայոց ձեռագրական ֆոնդի, մանրանկարչության դպրոցների և փիլիսոփայական տեքստերի համապարփակ հետազոտություն:",
        authorIds: ["mesrop-mashtots", "grigor-tatevatsi"],
        centerIds: ["matenadaran"]
      },
      {
        id: "pub-matenadaran-translations",
        title: "Անտիկ և Արևելյան Փիլիսոփայական Թարգմանությունները Մատենադարանում",
        year: "2023",
        type: "Հոդված",
        pages: 45,
        downloadUrl: "",
        description: "Արիստոտելի, Պլատոնի և Փիլոն Եբրայեցու հայերեն թարգմանությունների համեմատական վերլուծություն:",
        authorIds: ["grigor-tatevatsi"],
        centerIds: ["matenadaran", "nas-ra"]
      },
      {
        id: "pub-islam-mosaic",
        title: "Իսլամ. Մոզաիկա, ոչ թե մոնոլիտ",
        year: "2003",
        type: "PDF",
        pages: 192,
        downloadUrl: "",
        description: "Քաղաքակրթական բազմազանության և հանդուրժողականության հիմնարար հետազոտություն։",
        authorIds: ["vardan-grigoryan"],
        centerIds: ["ararat-center"]
      },
      {
        id: "pub-book-path",
        title: "Գրքերի ճանապարհը. Ինքնակենսագրություն",
        year: "2005",
        type: "Մենագրություն",
        pages: 350,
        downloadUrl: "",
        description: "Հիշողություններ և խորհրդածություններ մշակույթի, գրադարանների և գիտության դերի մասին։",
        authorIds: ["vardan-grigoryan"],
        centerIds: ["ararat-center"]
      },
      {
        id: "pub-narekatsi-tragedy",
        title: "Մատյան Ողբերգության (Գիտական վերլուծություն)",
        year: "1003",
        type: "PDF",
        pages: 420,
        downloadUrl: "",
        description: "Մարդաբանական և աստվածաբանական անզուգական ձեռագիր ժառանգություն։",
        authorIds: ["naregatsi"],
        centerIds: ["matenadaran", "nas-ra"]
      }
    ]
  },
  {
    id: "rus",
    slug: "russian",
    nameHy: "Ռուսական քաղաքակրթություն",
    nameEn: "Russian Civilization",
    symbol: "☦",
    badge: "Հարության Կենսիմաստ",
    tagline: "Հարության քաղաքակրթական կենսիմաստ և Սոբորնոստ",
    credo: "«Հարության քաղաքակրթական կենսիմաստը, սոբորնոստը (համայնականությունը) և պատմական առաքելությունը՝ որպես հոգևոր այլընտրանք տեխնոկրատական ապամարդկայնացմանը, նիհիլիզմին և գլոբալ միաբևեռությանը։»",
    overview: "Ռուսական քաղաքակրթական դպրոցը հիմնված է արևելաքրիստոնեական ավանդույթի, համայնականության (սոբորնոստ) և եվրասիական աշխարհագրական ընդարձակության վրա։ Դրա հիմքում մշտապես եղել է գերագույն արդարության և հոգևոր փրկության գաղափարը։",
    centers: [
      {
        id: "valdai",
        name: "«Վալդայ» Միջազգային Բանավեճի Ակումբ",
        originalName: "Valdai Discussion Club",
        city: "Մոսկվա",
        country: "Ռուսաստան",
        foundedYear: "2004",
        description: "Համաշխարհային մակարդակի վերլուծական հարթակ, որը համախմբում է աշխարհի առաջատար քաղաքագետներին և քաղաքակրթական մտածողներին։",
        focusAreas: ["Բազմաբևեռ աշխարհակարգ", "Եվրասիական անվտանգություն", "Գլոբալ կառավարում"],
        website: "https://valdaiclub.com",
        publicationIds: ["pub-rus-global-disorder", "pub-rus-civilizational-choice"]
      },
      {
        id: "ran-philosophy",
        name: "ՌԳԱ Փիլիսոփայության Ինստիտուտ",
        originalName: "Institute of Philosophy, Russian Academy of Sciences",
        city: "Մոսկվա",
        country: "Ռուսաստան",
        foundedYear: "1929",
        description: "Ռուսաստանի հիմնարար փիլիսոփայական կենտրոնը, որտեղ զարգացվում են ռուսական կոսմիզմի, էթիկայի և քաղաքակրթությունների տեսությունները։",
        focusAreas: ["Ռուսական փիլիսոփայություն", "Էպիստեմոլոգիա", "Մշակույթի փիլիսոփայություն"],
        website: "https://iphras.ru",
        publicationIds: ["pub-rus-meaning-creation", "pub-rus-sobornost"]
      },
      {
        id: "izborsk",
        name: "Իզբորսկի Ակումբ",
        originalName: "Izborsk Club",
        city: "Մոսկվա / Իզբորսկ",
        country: "Ռուսաստան",
        foundedYear: "2012",
        description: "Ռուսական հայրենասիրական և պահպանողական փորձագիտական միավորում, որը ձևակերպում է Ռուսաստանի քաղաքակրթական ինքնիշխանության դոկտրինը։",
        focusAreas: ["Ավանդական արժեքներ", "Պետական ինքնիշխանություն", "Քաղաքակրթական գաղափարախոսություն"],
        website: "https://izborsk-club.ru",
        publicationIds: ["pub-rus-civilizational-choice", "pub-rus-sobornost"]
      }
    ],
    authors: [
      {
        id: "fyodor-lukyanov",
        name: "Ֆյոդոր Լուկյանով (Fyodor Lukyanov)",
        nameOriginal: "Фёдор Лукьянов",
        title: "Քաղաքագետ, «Ռուսաստանը գլոբալ քաղաքականության մեջ» հանդեսի գլխավոր խմբագիր",
        bio: "Ռուսաստանի արտաքին քաղաքականության և միջազգային հարաբերությունների առաջատար վերլուծաբան, Վալդայ ակումբի գիտական տնօրեն։",
        quote: "«Աշխարհը մտնում է մի դարաշրջան, որտեղ քաղաքակրթությունների յուրահատկությունն ավելի զորեղ է, քան արհեստականորեն պարտադրված միօրինակությունը։»",
        publicationIds: ["pub-rus-global-disorder", "pub-rus-civilizational-choice", "pub-rus-sobornost"],
        publications: [
          {
            id: "pub-rus-global-disorder",
            title: "«Գլոբալ անկարգության դարաշրջանը»",
            year: "2020",
            type: "PDF",
            description: "Միջազգային համակարգի փոխակերպման և ինքնիշխանության վերադարձի վերլուծություն։",
            pages: 240
          },
          {
            id: "pub-rus-civilizational-choice",
            title: "«Ռուսաստանի քաղաքակրթական ընտրությունը»",
            year: "2023",
            type: "Զեկույց",
            description: "Անդրադարձ Եվրասիական ինքնությանը և ապագայի մոդելներին։",
            pages: 82
          }
        ]
      },
      {
        id: "nikolai-berdyaev",
        name: "Նիկոլայ Բերդյաև (Ժառանգություն)",
        nameOriginal: "Николай Бердяев",
        title: "Էկզիստենցիալ-քրիստոնեական փիլիսոփա",
        bio: "20-րդ դարի մեծագույն ռուս մտածողներից, ով հիմնավորել է մարդու անձնային ազատության և արարչագործական կոչման անխախտելիությունը։",
        quote: "«Արարչագործությունն անցում է ոչնչից դեպի գոյություն․ մարդը կոչված է լինել Աստծո համագործակիցը։»",
        publicationIds: ["pub-rus-meaning-creation", "pub-rus-sobornost"],
        publications: [
          {
            id: "pub-rus-meaning-creation",
            title: "«Արարչագործության իմաստը»",
            year: "1916",
            type: "PDF",
            description: "Մարդու արարչականության և ազատության փիլիսոփայական հիմքերը։",
            pages: 310
          }
        ]
      }
    ],
    publications: [
      {
        id: "pub-rus-global-disorder",
        civId: "rus",
        title: "«Գլոբալ անկարգության դարաշրջանը»",
        year: "2020",
        type: "PDF",
        description: "Միջազգային համակարգի փոխակերպման և ինքնիշխանության վերադարձի վերլուծություն։",
        pages: 240,
        authorIds: ["fyodor-lukyanov"],
        centerIds: ["valdai"]
      },
      {
        id: "pub-rus-civilizational-choice",
        civId: "rus",
        title: "«Ռուսաստանի քաղաքակրթական ընտրությունը»",
        year: "2023",
        type: "Զեկույց",
        description: "Անդրադարձ Եվրասիական ինքնությանը և ապագայի մոդելներին։",
        pages: 82,
        authorIds: ["fyodor-lukyanov"],
        centerIds: ["valdai", "izborsk"]
      },
      {
        id: "pub-rus-meaning-creation",
        civId: "rus",
        title: "«Արարչագործության իմաստը»",
        year: "1916",
        type: "PDF",
        description: "Մարդու արարչականության և ազատության փիլիսոփայական հիմքերը։",
        pages: 310,
        authorIds: ["nikolai-berdyaev"],
        centerIds: ["ran-philosophy"]
      },
      {
        id: "pub-rus-sobornost",
        civId: "rus",
        title: "«Սոբորնոստ և Եվրասիական ինքնիշխանություն»",
        year: "2022",
        type: "Հոդված",
        description: "Համայնականության սկզբունքի արդի վերաիմաստավորումը քաղաքակրթական բազմաբևեռության մեջ։",
        pages: 48,
        authorIds: ["nikolai-berdyaev", "fyodor-lukyanov"],
        centerIds: ["ran-philosophy", "izborsk"]
      }
    ]
  },
  {
    id: "eur",
    slug: "european",
    nameHy: "Եվրոպական քաղաքակրթություն",
    nameEn: "European Civilization",
    symbol: "🏛",
    badge: "Ավանդական Եվրոպա և Դասական Միտք",
    tagline: "Ավանդական Եվրոպայի պահպանողական միտք և դասականություն",
    credo: "«Ավանդական Եվրոպայի պահպանողական միտքը, դասական փիլիսոփայությունը, քրիստոնեական ոգին և ինքնիշխան ազգերի արժանապատվությունը՝ որպես վահան մշակութային ինքնամոռացության և տրանսհումանիզմի դեմ։»",
    overview: "Եվրոպական քաղաքակրթությունը՝ Աթենքի ռացիոնալիզմի, Հռոմի իրավունքի և Երուսաղեմի հավատքի միաձուլումն է։ Ավանդական Եվրոպայի ջատագովները ձգտում են վերականգնել մայրցամաքի քրիստոնեական և դասական մշակութային առանցքը։",
    centers: [
      {
        id: "mcc-budapest",
        name: "Մաթիաս Կորվինուս Կոլեգիում (MCC)",
        originalName: "Mathias Corvinus Collegium",
        city: "Բուդապեշտ",
        country: "Հունգարիա",
        foundedYear: "1996",
        description: "Կենտրոնական Եվրոպայի առաջատար կրթական և ինտելեկտուալ հաստատությունը, որը նպաստում է պահպանողական և ազգային-ինքնիշխան մտքի զարգացմանը։",
        focusAreas: ["Եվրոպական ինքնություն", "Կրթական առաջնորդություն", "Ավանդական արժեքներ"],
        website: "https://mcc.hu",
        publicationIds: ["pub-eur-multipolar-vision", "pub-eur-oikophilia"]
      },
      {
        id: "institut-iliade",
        name: "«Իլիադա» Ինստիտուտ",
        originalName: "Institut Iliade pour la longue mémoire européenne",
        city: "Փարիզ",
        country: "Ֆրանսիա",
        foundedYear: "2014",
        description: "Եվրոպական երկարաժամկետ հիշողության և քաղաքակրթական ինքնության պահպանմանն ուղղված ֆրանսիական ակադեմիական կենտրոն։",
        focusAreas: ["Եվրոպական հիշողություն", "Դասական մշակույթ", "Քաղաքակրթական ինքնություն"],
        website: "https://institut-iliade.com",
        publicationIds: ["pub-eur-human-rights-illusion", "pub-eur-multipolar-vision"]
      },
      {
        id: "edmund-burke-foundation",
        name: "Էդմունդ Բյորկի Հիմնադրամ",
        originalName: "Edmund Burke Foundation",
        city: "Հռոմ / Լոնդոն",
        country: "Եվրոպա",
        foundedYear: "2019",
        description: "Ազգային պահպանողականության (National Conservatism) և դասական արևմտյան արժեքների վերականգնմանն ուղղված միջազգային դաշինք։",
        focusAreas: ["Ազգային ինքնիշխանություն", "Ընտանիք և հավատք", "Քաղաքական փիլիսոփայություն"],
        website: "https://nationalconservatism.org",
        publicationIds: ["pub-eur-beauty", "pub-eur-oikophilia"]
      }
    ],
    authors: [
      {
        id: "alain-de-benoist",
        name: "Ալեն դը Բենուա (Alain de Benoist)",
        nameOriginal: "Alain de Benoist",
        title: "Փիլիսոփա, «Նոր Աջ» (Nouvelle Droite) դպրոցի հիմնադիր",
        bio: "Ֆրանսիացի ազդեցիկ մտածող և էսսեիստ, ով տասնամյակներ շարունակ պայքարում է լիբերալ միատարրության դեմ՝ պաշտպանելով ժողովուրդների ինքնության և մշակութային բազմազանության իրավունքը։",
        quote: "«Տեխնոլոգիան և շուկան չեն կարող փոխարինել մարդու մշակութային և հոգևոր արմատներին։»",
        publicationIds: ["pub-eur-human-rights-illusion", "pub-eur-multipolar-vision"],
        publications: [
          {
            id: "pub-eur-human-rights-illusion",
            title: "«Մարդու իրավունքների պատրանքը»",
            year: "2004",
            type: "PDF",
            description: "Լիբերալ գաղափարախոսության քննադատություն և համայնքային արժեքների հաստատում։",
            pages: 180
          },
          {
            id: "pub-eur-multipolar-vision",
            title: "«Բազմաբևեռ աշխարհի եվրոպական տեսլականը»",
            year: "2017",
            type: "PDF",
            description: "Եվրոպայի քաղաքակրթական ինքնիշխանության վերականգնման ուղիները։",
            pages: 215
          }
        ]
      },
      {
        id: "roger-scruton",
        name: "Սըր Ռոջեր Սքրութոն (Ժառանգություն)",
        nameOriginal: "Sir Roger Scruton",
        title: "Բրիտանացի փիլիսոփա, էսթետ, պահպանողական մտքի դասական",
        bio: "Արվեստի, ճարտարապետության և ավանդական քաղաքական փիլիսոփայության գիտակ, ով պաշտպանում էր գեղեցկության, սրբության և տնայնության (oikophilia) գաղափարները։",
        quote: "«Գեղեցկությունը պատահականություն չէ, այլ մեր գոյության սրբազան պահանջը։»",
        publicationIds: ["pub-eur-beauty", "pub-eur-oikophilia"],
        publications: [
          {
            id: "pub-eur-beauty",
            title: "«Գեղեցկություն»",
            year: "2009",
            type: "PDF",
            description: "Էսթետիկայի և հոգևոր արժեքների պաշտպանություն արդի աշխարհում։",
            pages: 208
          }
        ]
      }
    ],
    publications: [
      {
        id: "pub-eur-human-rights-illusion",
        civId: "eur",
        title: "«Մարդու իրավունքների պատրանքը»",
        year: "2004",
        type: "PDF",
        description: "Լիբերալ գաղափարախոսության քննադատություն և համայնքային արժեքների հաստատում։",
        pages: 180,
        authorIds: ["alain-de-benoist"],
        centerIds: ["institut-iliade"]
      },
      {
        id: "pub-eur-multipolar-vision",
        civId: "eur",
        title: "«Բազմաբևեռ աշխարհի եվրոպական տեսլականը»",
        year: "2017",
        type: "PDF",
        description: "Եվրոպայի քաղաքակրթական ինքնիշխանության վերականգնման ուղիները։",
        pages: 215,
        authorIds: ["alain-de-benoist"],
        centerIds: ["mcc-budapest", "institut-iliade"]
      },
      {
        id: "pub-eur-beauty",
        civId: "eur",
        title: "«Գեղեցկություն»",
        year: "2009",
        type: "PDF",
        description: "Էսթետիկայի և հոգևոր արժեքների պաշտպանություն արդի աշխարհում։",
        pages: 208,
        authorIds: ["roger-scruton"],
        centerIds: ["edmund-burke-foundation"]
      },
      {
        id: "pub-eur-oikophilia",
        civId: "eur",
        title: "«Տնայնություն (Oikophilia) և Եվրոպական ինքնություն»",
        year: "2015",
        type: "Զեկույց",
        pages: 96,
        description: "Սեփական հայրենիքի և մշակութային ժառանգության պաշտպանությունը որպես էկոլոգիական և հոգևոր պարտք։",
        authorIds: ["roger-scruton"],
        centerIds: ["mcc-budapest", "edmund-burke-foundation"]
      }
    ]
  },
  {
    id: "irn",
    slug: "iranian",
    nameHy: "Իրանական քաղաքակրթություն",
    nameEn: "Iranian Civilization",
    symbol: "🪔",
    badge: "Հիքմա և Հոգևոր Ինքնիշխանություն",
    tagline: "Իսլամական արդիականություն և իմաստնության փիլիսոփայություն",
    credo: "«Իսլամական արդիականության, իմաստնության (հիքմա) և պարսկական բազմադարյա քաղաքակրթական արժանապատվության միաձուլումը՝ արդարության և հոգևոր ինքնիշխանության համատեքստում։»",
    overview: "Իրանական քաղաքակրթությունը կրում է զրադաշտական հնագույն արմատներ և իսլամական միստիցիզմի (սուֆիզմ, իշրաքիյա) անսահման խորությունը։ Այն առաջարկում է հավատքի և բանականության սինթեզ, որը հրաժարվում է արևմտյան աշխարհիկացման մոդելներից։",
    centers: [
      {
        id: "ipis-tehran",
        name: "Քաղաքական և Միջազգային Հետազոտությունների Ինստիտուտ (IPIS)",
        originalName: "Institute for Political and International Studies",
        city: "Թեհրան",
        country: "Իրան",
        foundedYear: "1983",
        description: "Իրանի գլխավոր արտաքին քաղաքական և քաղաքակրթական ուղեղային կենտրոնը, որը գործում է ԱԳՆ հովանու ներքո։",
        focusAreas: ["Իսլամական աշխարհ", "Տարածաշրջանային անվտանգություն", "Քաղաքակրթական երկխոսություն"],
        website: "https://ipis.ir",
        publicationIds: ["pub-irn-man-nature", "pub-irn-hikmat-multipolar"]
      },
      {
        id: "qom-academy",
        name: "Ղոմի Իսլամական Գիտությունների և Փիլիսոփայության Ակադեմիա",
        originalName: "Islamic Sciences and Culture Academy (Qom)",
        city: "Ղոմ",
        country: "Իրան",
        foundedYear: "1985",
        description: "Շիա իսլամական աստվածաբանության, փիլիսոփայության (Հիքմաթե Մոթաալիյե) և իրավունքի խոշորագույն հետազոտական հաստատությունը։",
        focusAreas: ["Իսլամական փիլիսոփայություն", "Էթիկա", "Միստիցիզմ"],
        website: "https://isca.ac.ir",
        publicationIds: ["pub-irn-knowledge-sacred", "pub-irn-hikmat-multipolar"]
      }
    ],
    authors: [
      {
        id: "seyyed-hossein-nasr",
        name: "Սեյյեդ Հոսեյն Նասր (Seyyed Hossein Nasr)",
        nameOriginal: "سید حسین نصر",
        title: "Փիլիսոփա, Ջորջ Վաշինգտոն համալսարանի պրոֆեսոր, Ավանդական Դպրոցի ներկայացուցիչ",
        bio: "Աշխարհահռչակ մտածող, ով հետազոտում է իսլամական փիլիսոփայությունը, էկոլոգիական ճգնաժամի հոգևոր արմատները և Սրբազանի վերականգնումը ժամանակակից աշխարհում։",
        quote: "«Արդի մարդու գլխավոր ողբերգությունն այն է, որ նա կորցրել է կապը Սրբազան Իմաստնության հետ։»",
        publicationIds: ["pub-irn-man-nature", "pub-irn-knowledge-sacred", "pub-irn-hikmat-multipolar"],
        publications: [
          {
            id: "pub-irn-man-nature",
            title: "«Մարդը և բնությունը. Հոգևոր ճգնաժամի պատճառները»",
            year: "1997",
            type: "PDF",
            description: "Էկոլոգիական աղետի հոգևոր և քաղաքակրթական ախտորոշումը։",
            pages: 160
          },
          {
            id: "pub-irn-knowledge-sacred",
            title: "«Սրբազանի իմացությունը»",
            year: "2001",
            type: "PDF",
            description: "Հավերժական փիլիսոփայության (Philosophia Perennis) մանիֆեստ։",
            pages: 360
          }
        ]
      }
    ],
    publications: [
      {
        id: "pub-irn-man-nature",
        civId: "irn",
        title: "«Մարդը և բնությունը. Հոգևոր ճգնաժամի պատճառները»",
        year: "1997",
        type: "PDF",
        description: "Էկոլոգիական աղետի հոգևոր և քաղաքակրթական ախտորոշումը։",
        pages: 160,
        authorIds: ["seyyed-hossein-nasr"],
        centerIds: ["ipis-tehran"]
      },
      {
        id: "pub-irn-knowledge-sacred",
        civId: "irn",
        title: "«Սրբազանի իմացությունը»",
        year: "2001",
        type: "PDF",
        description: "Հավերժական փիլիսոփայության (Philosophia Perennis) մանիֆեստ։",
        pages: 360,
        authorIds: ["seyyed-hossein-nasr"],
        centerIds: ["qom-academy"]
      },
      {
        id: "pub-irn-hikmat-multipolar",
        civId: "irn",
        title: "«Իմաստնության փիլիսոփայությունը և բազմաբևեռության երկխոսությունը»",
        year: "2022",
        type: "Զեկույց",
        description: "Շիա փիլիսոփայության (Հիքմաթե Մոթաալիյե) դերը արևելյան քաղաքակրթությունների մերձեցման գործում։",
        pages: 112,
        authorIds: ["seyyed-hossein-nasr"],
        centerIds: ["ipis-tehran", "qom-academy"]
      }
    ]
  },
  {
    id: "arb",
    slug: "arabic",
    nameHy: "Արաբական քաղաքակրթություն",
    nameEn: "Arabic Civilization",
    symbol: "☪",
    badge: "Ինտելեկտուալ Օրրան և Վերածնունդ",
    tagline: "Բեյրութի, Կահիրեի և Աբու Դաբիի ինտելեկտուալ օրրաններ",
    credo: "«Արաբական ինտելեկտուալ վերածնունդը, գիտական ու փիլիսոփայական ոսկեդարի ավանդույթները և իսլամական համամարդկային արժեքների ներդաշնակումը ժամանակակից աշխարհաքաղաքական և գիտական մարտահրավերների հետ։»",
    overview: "Արաբական քաղաքակրթությունը միջնադարում փրկել և հարստացրել է համաշխարհային գիտությունն ու փիլիսոփայությունը (Ավիցեննա, Ավերոես, Իբն Խալդուն)։ Այսօր այն ապրում է նոր մտավոր զարթոնք՝ համադրելով ավանդույթն ու արդիականությունը։",
    centers: [
      {
        id: "al-azhar",
        name: "Ալ-Ազհարի Համալսարան և Հետազոտական Կենտրոն",
        originalName: "Al-Azhar University (جامعة الأزهر)",
        city: "Կահիրե",
        country: "Եգիպտոս",
        foundedYear: "970",
        description: "Սուննի իսլամական աշխարհի ամենահին և հեղինակավոր համալսարանը, միջկրոնական երկխոսության առանցքային կենտրոն։",
        focusAreas: ["Իսլամագիտություն", "Միջկրոնական երկխոսություն", "Արաբական լեզվաբանություն"],
        website: "http://azhar.edu.eg",
        publicationIds: ["pub-arb-moral-modernity", "pub-arb-dialogue-civilizations"]
      },
      {
        id: "trends-research",
        name: "«Trends» Հետազոտությունների և Խորհրդատվության Կենտրոն",
        originalName: "TRENDS Research & Advisory",
        city: "Աբու Դաբի",
        country: "ԱՄԷ",
        foundedYear: "2014",
        description: "Մերձավոր Արևելքի արագ զարգացող վերլուծական կենտրոններից մեկը, որն ուսումնասիրում է աշխարհաքաղաքական և տեխնոլոգիական միտումները։",
        focusAreas: ["Տեխնոլոգիական ապագա", "Աշխարհաքաղաքականություն", "Քաղաքակրթական հանդուրժողականություն"],
        website: "https://trendsresearch.org",
        publicationIds: ["pub-arb-dialogue-civilizations", "pub-arb-future-trends"]
      }
    ],
    authors: [
      {
        id: "taha-abdurrahman",
        name: "Տահա Աբդուրրահման (Taha Abdurrahman)",
        nameOriginal: "طه عبد الرحمن",
        title: "Մարոկկացի փիլիսոփա, տրամաբան, էթիկայի տեսաբան",
        bio: "Արաբական աշխարհի ամենաինքնատիպ ժամանակակից փիլիսոփաներից մեկը, ով մշակել է իսլամական արդիականության ինքնուրույն բարոյական մոդելը։",
        quote: "«Առանց էթիկայի արդիականությունը վերածվում է կուրության, իսկ ճշմարիտ արդիականությունն առաջին հերթին հոգևոր արթնություն է։»",
        publicationIds: ["pub-arb-moral-modernity", "pub-arb-dialogue-civilizations", "pub-arb-future-trends"],
        publications: [
          {
            id: "pub-arb-moral-modernity",
            title: "«Արդիականության բարոյական հարցը»",
            year: "2006",
            type: "PDF",
            description: "Արևմտյան արդիականության քննադատություն և բարոյական ինքնավարության վերականգնում։",
            pages: 250
          }
        ]
      }
    ],
    publications: [
      {
        id: "pub-arb-moral-modernity",
        civId: "arb",
        title: "«Արդիականության բարոյական հարցը»",
        year: "2006",
        type: "PDF",
        description: "Արևմտյան արդիականության քննադատություն և բարոյական ինքնավարության վերականգնում։",
        pages: 250,
        authorIds: ["taha-abdurrahman"],
        centerIds: ["al-azhar"]
      },
      {
        id: "pub-arb-dialogue-civilizations",
        civId: "arb",
        title: "«Քաղաքակրթական երկխոսության էթիկական սկզբունքները»",
        year: "2019",
        type: "Զեկույց",
        description: "Իսլամական ինքնության և համաշխարհային մշակույթների արդար համակեցության մոդելը։",
        pages: 134,
        authorIds: ["taha-abdurrahman"],
        centerIds: ["al-azhar", "trends-research"]
      },
      {
        id: "pub-arb-future-trends",
        civId: "arb",
        title: "«Արաբական մտքի ապագան տեխնոլոգիական դարաշրջանում»",
        year: "2023",
        type: "Հոդված",
        description: "Արհեստական բանականության և ավանդական էթիկայի համադրումը մերձավորարևելյան տարածաշրջանում։",
        pages: 78,
        authorIds: ["taha-abdurrahman"],
        centerIds: ["trends-research"]
      }
    ]
  },
  {
    id: "grk",
    slug: "greek",
    nameHy: "Հունական քաղաքակրթություն",
    nameEn: "Greek Civilization",
    symbol: "🏛",
    badge: "Բյուզանդական Կոդ և Աթոսի Լույս",
    tagline: "Անտիկ ժառանգություն, Բյուզանդական կոդ և Աթոսի հոգևոր միտք",
    credo: "«Անտիկ դասական ռացիոնալիզմի, Բյուզանդական քաղաքակրթական կոդի և Աթոսի հոգևոր լույսի սինթեզը՝ մարդու աստվածացման (թեոզիս), ազատության և ճշմարտության հավերժական որոնումով։»",
    overview: "Հունական քաղաքակրթությունն աշխարհին պարգևել է փիլիսոփայությունը, ժողովրդավարությունը, գեղագիտությունը և Բյուզանդիայի աստվածաբանական խորությունը։ Աթոսի հոգևոր կենտրոնը պահպանում է ասկետիկ իմաստնության կենդանի ավանդույթը։",
    centers: [
      {
        id: "athos-academy",
        name: "Աթոսի Սուրբ Լեռան Հոգևոր Ակադեմիա",
        originalName: "Athonite Spiritual Heritage Center (Mount Athos)",
        city: "Կարիես",
        country: "Հունաստան / Աթոս",
        foundedYear: "1749",
        description: "Ուղղափառ ասկետիկ աստվածաբանության և հեսիխազմի համաշխարհային հոգևոր կենտրոնը, որտեղ դարեր շարունակ պահպանվում է անխաթար հոգևոր կյանքը։",
        focusAreas: ["Հեսիխազմ", "Բյուզանդական ձեռագրեր", "Միստիկ աստվածաբանություն"],
        website: "https://mountathos.org",
        publicationIds: ["pub-grk-europe-crisis", "pub-grk-hesychasm"]
      },
      {
        id: "academy-of-athens",
        name: "Աթենքի Ակադեմիա",
        originalName: "Academy of Athens (Ακαδημία Αθηνών)",
        city: "Աթենք",
        country: "Հունաստան",
        foundedYear: "1926",
        description: "Հունաստանի ազգային ակադեմիան՝ Պլատոնի Ակադեմիայի պատմական իրավահաջորդը, որը զբաղվում է անտիկ և ժամանակակից փիլիսոփայական ժառանգությամբ։",
        focusAreas: ["Դասական փիլիսոփայություն", "Բյուզանդագիտություն", "Միջերկրածովյան մշակույթ"],
        website: "http://academyofathens.gr",
        publicationIds: ["pub-grk-person-eros", "pub-grk-europe-crisis"]
      }
    ],
    authors: [
      {
        id: "christos-yannaras",
        name: "Խրիստոս Յաննարաս (Christos Yannaras)",
        nameOriginal: "Χρήστος Γιανναράς",
        title: "Փիլիսոփա, աստվածաբան, Պանտեոն համալսարանի պատվավոր պրոֆեսոր",
        bio: "Հույն խոշորագույն ժամանակակից մտածող, ով մշակել է անձի գոյաբանության և արևմտյան ռացիոնալիզմի քննադատության ինքնատիպ համակարգ։",
        quote: "«Ճշմարտությունը ոչ թե մտավոր կոնցեպտ է, այլ կենդանի հարաբերություն և հաղորդակցություն։»",
        publicationIds: ["pub-grk-person-eros", "pub-grk-europe-crisis", "pub-grk-hesychasm"],
        publications: [
          {
            id: "pub-grk-person-eros",
            title: "«Անձը և Էրոսը. Գոյաբանական մոտեցում»",
            year: "1976",
            type: "PDF",
            description: "Մարդկային անձի ազատության և սիրո գոյաբանական ուսումնասիրություն։",
            pages: 280
          },
          {
            id: "pub-grk-europe-crisis",
            title: "«Եվրոպայի ճգնաժամը և արևելյան հայացքը»",
            year: "2010",
            type: "PDF",
            description: "Արևմտյան մոդեռնիզմի հոգևոր պատճառահետևանքային կապերը։",
            pages: 195
          }
        ]
      }
    ],
    publications: [
      {
        id: "pub-grk-person-eros",
        civId: "grk",
        title: "«Անձը և Էրոսը. Գոյաբանական մոտեցում»",
        year: "1976",
        type: "PDF",
        description: "Մարդկային անձի ազատության և սիրո գոյաբանական ուսումնասիրություն։",
        pages: 280,
        authorIds: ["christos-yannaras"],
        centerIds: ["academy-of-athens"]
      },
      {
        id: "pub-grk-europe-crisis",
        civId: "grk",
        title: "«Եվրոպայի ճգնաժամը և արևելյան հայացքը»",
        year: "2010",
        type: "PDF",
        description: "Արևմտյան մոդեռնիզմի հոգևոր պատճառահետևանքային կապերը։",
        pages: 195,
        authorIds: ["christos-yannaras"],
        centerIds: ["academy-of-athens", "athos-academy"]
      },
      {
        id: "pub-grk-hesychasm",
        civId: "grk",
        title: "«Հեսիխազմ և Բյուզանդական Լույս»",
        year: "2018",
        type: "Գիտական Զեկույց",
        description: "Աթոսի հոգևոր ժառանգության և լռության աստվածաբանության դերը մարդու աստվածացման (թեոզիս) ճանապարհին։",
        pages: 140,
        authorIds: ["christos-yannaras"],
        centerIds: ["athos-academy"]
      }
    ]
  },
  {
    id: "ind",
    slug: "indian",
    nameHy: "Հնդկական քաղաքակրթություն",
    nameEn: "Indian Civilization",
    symbol: "ॐ",
    badge: "Սանատանա Դհարմա և Համայն Աշխարհ",
    tagline: "Վեդայական ավանդույթ և «Վասուդհայվա Կուտումբակամ» տեսլական",
    credo: "«Վեդայական հավերժական իմաստությունը (Սանատանա Դհարմա) և «Վասուդհայվա Կուտումբակամ» (Աշխարհը մեկ ընտանիք է) տեսլականը՝ բազմազանության մեջ տիեզերական միասնության և կարմայական ներդաշնակության վավերացում։»",
    overview: "Հնդկական քաղաքակրթությունը՝ հոգևոր հայեցողության, կարմայի և դհարմայի անսահման օվկիանոս է։ Դրա համընդհանուր կարգախոսն է «Վասուդհայվա Կուտումբակամ»՝ ամբողջ աշխարհը մեկ ընտանիք է, որտեղ յուրաքանչյուր արարած ունի իր սրբազան տեղը։",
    centers: [
      {
        id: "icpr",
        name: "Փիլիսոփայական Հետազոտությունների Հնդկական Խորհուրդ (ICPR)",
        originalName: "Indian Council of Philosophical Research",
        city: "Նյու Դելի",
        country: "Հնդկաստան",
        foundedYear: "1977",
        description: "Հնդկաստանի կառավարության բարձրագույն գիտական մարմինը, որը զարգացնում է հնդկական դասական և համեմատական փիլիսոփայությունը։",
        focusAreas: ["Վեդանտա", "Յոգայի փիլիսոփայություն", "Էթիկա", "Գիտակցության հետազոտություններ"],
        website: "https://icpr.in",
        publicationIds: ["pub-ind-indian-philosophy", "pub-ind-eastern-religions", "pub-ind-vasudhaiva-kutumbakam"]
      },
      {
        id: "ignca",
        name: "Ինդիրա Գանդիի անվան Արվեստների Ազգային Կենտրոն (IGNCA)",
        originalName: "Indira Gandhi National Centre for the Arts",
        city: "Նյու Դելի",
        country: "Հնդկաստան",
        foundedYear: "1987",
        description: "Հնդկական հոգևոր, արվեստի և քաղաքակրթական ավանդույթների համալիր հետազոտական ինստիտուտ։",
        focusAreas: ["Հնդկական մտածողություն", "Սակրալ արվեստ", "Մշակութային ժառանգություն"],
        website: "https://ignca.gov.in",
        publicationIds: ["pub-ind-eastern-religions", "pub-ind-why-iam-hindu"]
      },
      {
        id: "orfonline",
        name: "Դիտորդական Հետազոտությունների Հիմնադրամ (ORF)",
        originalName: "Observer Research Foundation",
        city: "Նյու Դելի",
        country: "Հնդկաստան",
        foundedYear: "1990",
        description: "Հնդկաստանի ամենաազդեցիկ միջազգային վերլուծական կենտրոնը, Ռայսինայի երկխոսության (Raisina Dialogue) կազմակերպիչը։",
        focusAreas: ["Գլոբալ կառավարում", "Բազմակողմանիություն", "Քաղաքակրթական դիվանագիտություն"],
        website: "https://orfonline.org",
        publicationIds: ["pub-ind-vasudhaiva-kutumbakam"]
      }
    ],
    authors: [
      {
        id: "sarvepalli-radhakrishnan",
        name: "Սարվեպալի Ռադհակրիշնան (Ժառանգություն)",
        nameOriginal: "Sarvepalli Radhakrishnan",
        title: "Փիլիսոփա, Հնդկաստանի նախկին նախագահ, Օքսֆորդի պրոֆեսոր",
        bio: "Հնդկական և արևմտյան փիլիսոփայության մեծագույն համադրողը, ով աշխարհին ներկայացրեց Վեդանտայի խորությունը և հոգևոր իդեալիզմը։",
        quote: "«Կրոնը ոչ թե դոգմա է, այլ կենսափորձ և հոգու վերափոխման արվեստ։»",
        publicationIds: ["pub-ind-indian-philosophy", "pub-ind-eastern-religions", "pub-ind-vasudhaiva-kutumbakam"],
        publications: [
          {
            id: "pub-ind-indian-philosophy",
            title: "«Հնդկական փիլիսոփայություն» (2 հատորով)",
            year: "1923",
            type: "PDF",
            description: "Հնդկական մտքի դասական համապարփակ հանրագիտարանային աշխատություն։",
            pages: 650
          },
          {
            id: "pub-ind-eastern-religions",
            title: "«Արևելյան կրոններ և արևմտյան միտք»",
            year: "1939",
            type: "PDF",
            description: "Քաղաքակրթական երկխոսության դասական հիմքերը։",
            pages: 380
          }
        ]
      },
      {
        id: "shashi-tharoor",
        name: "Շաշի Թարուր (Shashi Tharoor)",
        nameOriginal: "Shashi Tharoor",
        title: "Հեղինակ, պետական գործիչ, դիվանագետ",
        bio: "Հնդկաստանի ժամանակակից ինքնության, փափուկ ուժի և պլյուրալիզմի ականավոր մտածող և գրող։",
        quote: "«Հնդկաստանի մեծությունը նրա բազմազանության մեջ է․ մենք համակեցություն ենք, ոչ թե միաձուլում։»",
        publicationIds: ["pub-ind-why-iam-hindu", "pub-ind-vasudhaiva-kutumbakam"],
        publications: [
          {
            id: "pub-ind-why-iam-hindu",
            title: "«Ինչու՞ եմ ես հինդու»",
            year: "2018",
            type: "PDF",
            description: "Հինդուիզմի հանդուրժողական և փիլիսոփայական էության բացահայտում։",
            pages: 302
          }
        ]
      }
    ],
    publications: [
      {
        id: "pub-ind-indian-philosophy",
        civId: "ind",
        title: "«Հնդկական փիլիսոփայություն» (2 հատորով)",
        year: "1923",
        type: "PDF",
        description: "Հնդկական մտքի դասական համապարփակ հանրագիտարանային աշխատություն։",
        pages: 650,
        authorIds: ["sarvepalli-radhakrishnan"],
        centerIds: ["icpr"]
      },
      {
        id: "pub-ind-eastern-religions",
        civId: "ind",
        title: "«Արևելյան կրոններ և արևմտյան միտք»",
        year: "1939",
        type: "PDF",
        description: "Քաղաքակրթական երկխոսության դասական հիմքերը։",
        pages: 380,
        authorIds: ["sarvepalli-radhakrishnan"],
        centerIds: ["icpr", "ignca"]
      },
      {
        id: "pub-ind-why-iam-hindu",
        civId: "ind",
        title: "«Ինչու՞ եմ ես հինդու»",
        year: "2018",
        type: "PDF",
        description: "Հինդուիզմի հանդուրժողական և փիլիսոփայական էության բացահայտում։",
        pages: 302,
        authorIds: ["shashi-tharoor"],
        centerIds: ["ignca"]
      },
      {
        id: "pub-ind-vasudhaiva-kutumbakam",
        civId: "ind",
        title: "«Վասուդհայվա Կուտումբակամ. Քաղաքակրթական դիվանագիտություն»",
        year: "2022",
        type: "Զեկույց",
        description: "«Աշխարհը մեկ ընտանիք է» վեդայական սկզբունքի կիրառումը միջազգային հարաբերություններում։",
        pages: 110,
        authorIds: ["shashi-tharoor", "sarvepalli-radhakrishnan"],
        centerIds: ["orfonline", "icpr"]
      }
    ]
  }
];

export function getAllCivilizations(): Civilization[] {
  return civilizationsData;
}

export function getCivilizationBySlug(slug: string): Civilization | undefined {
  const normalized = slug.toLowerCase().trim();
  return civilizationsData.find(
    (civ) => civ.slug.toLowerCase() === normalized || civ.id.toLowerCase() === normalized
  );
}

export function findCenterById(id: string): { center: ThinkTank; civ: Civilization } | undefined {
  const normalized = id.toLowerCase().trim();
  for (const civ of civilizationsData) {
    const center = civ.centers.find(
      (c) => c.id.toLowerCase() === normalized || c.name.toLowerCase() === normalized
    );
    if (center) return { center, civ };
  }
  return undefined;
}

export function findAuthorById(id: string): { author: Thinker; civ: Civilization } | undefined {
  const normalized = id.toLowerCase().trim();
  for (const civ of civilizationsData) {
    if (civ.authors) {
      const author = civ.authors.find(
        (a) => a.id.toLowerCase() === normalized || a.name.toLowerCase() === normalized
      );
      if (author) return { author, civ };
    }
    if (civ.centers) {
      for (const center of civ.centers) {
        if (center.authors) {
          const author = center.authors.find(
            (a) => a.id.toLowerCase() === normalized || a.name.toLowerCase() === normalized
          );
          if (author) return { author, civ };
        }
      }
    }
  }
  return undefined;
}

export function getAllCenterIds(): string[] {
  const ids: string[] = [];
  for (const civ of civilizationsData) {
    for (const center of civ.centers) {
      ids.push(center.id);
    }
  }
  return ids;
}

export function getAllAuthorIds(): string[] {
  const ids = new Set<string>();
  for (const civ of civilizationsData) {
    if (civ.authors) {
      for (const author of civ.authors) {
        ids.add(author.id);
      }
    }
    if (civ.centers) {
      for (const center of civ.centers) {
        if (center.authors) {
          for (const author of center.authors) {
            ids.add(author.id);
          }
        }
      }
    }
  }
  return Array.from(ids);
}

export function findPublicationById(
  pubId: string
): { pub: Publication; civ: Civilization } | undefined {
  const normalized = pubId.toLowerCase();
  for (const civ of civilizationsData) {
    if (civ.publications) {
      const pub = civ.publications.find((p) => p.id?.toLowerCase() === normalized);
      if (pub) return { pub, civ };
    }
    if (civ.authors) {
      for (const a of civ.authors) {
        if (a.publications) {
          const pub = a.publications.find((p) => p.id?.toLowerCase() === normalized);
          if (pub) return { pub, civ };
        }
      }
    }
    if (civ.centers) {
      for (const c of civ.centers) {
        if (c.publications) {
          const pub = c.publications.find((p) => p.id?.toLowerCase() === normalized);
          if (pub) return { pub, civ };
        }
      }
    }
  }
  return undefined;
}

export interface PublicationWithDetails {
  pub: Publication;
  civ: Civilization;
  author?: Thinker;
  center?: ThinkTank;
}

export function getAllLocalPublicationsWithDetails(): PublicationWithDetails[] {
  const map = new Map<string, PublicationWithDetails>();

  for (const civ of civilizationsData) {
    // 1. civ.publications
    if (civ.publications) {
      for (const pub of civ.publications) {
        if (!pub.id) continue;
        const author = pub.authorIds?.[0]
          ? civ.authors?.find((a) => a.id.toLowerCase() === pub.authorIds![0].toLowerCase())
          : undefined;
        const center = pub.centerIds?.[0]
          ? civ.centers?.find((c) => c.id.toLowerCase() === pub.centerIds![0].toLowerCase())
          : undefined;
        map.set(pub.id.toLowerCase(), { pub, civ, author, center });
      }
    }
    // 2. authors publications
    if (civ.authors) {
      for (const a of civ.authors) {
        if (a.publications) {
          for (const pub of a.publications) {
            if (!pub.id) continue;
            if (!map.has(pub.id.toLowerCase())) {
              const center = pub.centerIds?.[0]
                ? civ.centers?.find((c) => c.id.toLowerCase() === pub.centerIds![0].toLowerCase())
                : undefined;
              map.set(pub.id.toLowerCase(), { pub, civ, author: a, center });
            }
          }
        }
      }
    }
    // 3. centers publications
    if (civ.centers) {
      for (const c of civ.centers) {
        if (c.publications) {
          for (const pub of c.publications) {
            if (!pub.id) continue;
            if (!map.has(pub.id.toLowerCase())) {
              const author = pub.authorIds?.[0]
                ? civ.authors?.find((a) => a.id.toLowerCase() === pub.authorIds![0].toLowerCase())
                : undefined;
              map.set(pub.id.toLowerCase(), { pub, civ, author, center: c });
            }
          }
        }
      }
    }
  }

  return Array.from(map.values());
}

export function getAllPublicationIds(): string[] {
  const details = getAllLocalPublicationsWithDetails();
  return details
    .map((d) => d.pub.id)
    .filter((id): id is string => Boolean(id));
}

export interface CivilCenterOption {
  id: string;
  name: string;
  originalName?: string;
  city?: string;
  civName: string;
  civSymbol: string;
  civSlug: string;
}

export function getAllCivilCenters(): CivilCenterOption[] {
  const list: CivilCenterOption[] = [];
  for (const civ of civilizationsData) {
    if (civ.centers) {
      for (const c of civ.centers) {
        list.push({
          id: c.id,
          name: c.name,
          originalName: c.originalName,
          city: c.city,
          civName: civ.nameHy,
          civSymbol: civ.symbol,
          civSlug: civ.slug,
        });
      }
    }
  }
  return list;
}

export interface ThinkerOption {
  id: string;
  name: string;
  nameOriginal?: string;
  title: string;
  bio?: string;
  quote?: string;
  civName: string;
  civSymbol: string;
  civSlug: string;
}

export function getAllThinkersOptions(): ThinkerOption[] {
  const list: ThinkerOption[] = [];
  for (const civ of civilizationsData) {
    if (civ.authors) {
      for (const a of civ.authors) {
        list.push({
          id: a.id,
          name: a.name,
          nameOriginal: a.nameOriginal,
          title: a.title,
          bio: a.bio,
          quote: a.quote,
          civName: civ.nameHy,
          civSymbol: civ.symbol,
          civSlug: civ.slug,
        });
      }
    }
  }
  return list;
}

