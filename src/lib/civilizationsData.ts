import { TranslationsMap } from "@/types/i18n";

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
  translations?: TranslationsMap<Record<string, unknown>>;
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
  translations?: TranslationsMap<Record<string, unknown>>;
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
  translations?: TranslationsMap<Record<string, unknown>>;
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
  translations?: TranslationsMap<Record<string, unknown>>;
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
    centers: [],
    authors: [],
    publications: []
  },
  {
    id: "arm",
    slug: "armenian",
    nameHy: "Հայկական քաղաքակրթություն",
    nameEn: "Armenian Civilization",
    symbol: "☩",
    badge: "Արարչական Կոդ",
    tagline: "Արարատյան Դոկտրին և Համարարչական Աշխարհակարգ",
    credo: "«Արարատյան Դոկտրինը» հռչակում է Համարարչության գաղափարը․ մարդու, ազգի և քաղաքակրթության կոչումն է ոչ թե տիրել կամ իշխել, այլ արարել և լինել Աստծո համագործակիցը՝ պահպանելով Տիեզերական Կարգն ու Բարոյական Օրենքը։",
    overview: "Հայոց քաղաքակրթական բևեռը Արևելքի և Արևմուտքի հոգևոր խաչմերուկն է, որը դարեր ի վեր սինթեզել է քրիստոնեական իմաստասիրությունը, հելլենիստական տրամաբանությունը և արևելյան հոգեբանությունը՝ ձևավորելով ինքնատիպ «Արարատյան մտածողություն»։",
    centers: [],
    authors: [],
    publications: []
  },
  {
    id: "rus",
    slug: "russian",
    nameHy: "Ռուսական քաղաքակրթություն",
    nameEn: "Russian Civilization",
    symbol: "☦",
    badge: "Հարության Կենսիմաստ",
    tagline: "«Սոբորնոստ» և համամարդկային պատասխանատվություն",
    credo: "«Սոբորնոստ» (Համախմբվածություն, Հոգևոր Միասնություն) և «Համաշխարհային զգայնություն»․ աշխարհակարգ՝ հիմնված հոգևոր եղբայրության, զոհողության և նյութապաշտության հաղթահարման վրա, որտեղ ազգերը ոչ թե ձուլվում են, այլ միավորվում բարձրագույն ճշմարտության շուրջ։",
    overview: "Ռուսական քաղաքակրթական ինքնությունը զարգացել է որպես յուրօրինակ եվրասիական տարածք, որտեղ միահյուսված են ուղղափառ աստվածաբանությունը, կայսերական պատասխանատվությունը և սոցիալական արդարության խորը որոնումները։",
    centers: [],
    authors: [],
    publications: []
  },
  {
    id: "eur",
    slug: "european",
    nameHy: "Եվրոպական քաղաքակրթություն",
    nameEn: "European Civilization",
    symbol: "🏛",
    badge: "Ավանդույթի Վերածնունդ",
    tagline: "Անտիկ Լոգոս, Քրիստոնեական Հումանիզմ և Օյկոֆիլիա",
    credo: "Անտիկ Լոգոսի, Քրիստոնեական Անհատականության և Օյկոֆիլիայի (Հայրենի Տան Սիրո) ներդաշնակում․ աշխարհակարգ՝ հիմնված ինքնիշխան ազգերի բազմազանության, բանականության գերակայության և հոգևոր արմատների հարգման վրա։",
    overview: "Եվրոպական ավանդական քաղաքակրթական միտքը մերժում է արմատախիլ գլոբալիզմը և վերադառնում է դասական փիլիսոփայության, աթենական բանականության և հռոմեական իրավական մշակույթի ակունքներին։",
    centers: [],
    authors: [],
    publications: []
  },
  {
    id: "irn",
    slug: "iranian",
    nameHy: "Իրանական քաղաքակրթություն",
    nameEn: "Iranian Civilization",
    symbol: "🪔",
    badge: "Լուսավորյալ Իմաստություն",
    tagline: "«Հիքմաթ» (Իմաստություն) և Լուսավորյալ Քաղաքակրթություն",
    credo: "«Հիքմաթ» (Սուրբ Իմաստություն) և Իշրաքի (Լուսավորման) փիլիսոփայություն․ աշխարհակարգ՝ հիմնված նյութական և հոգևոր աշխարհների ներդաշնակության, արդար առաջնորդության և բարոյական բարձրագույն իդեալների վրա։",
    overview: "Իրանական քաղաքակրթությունը միավորում է նախաիսլամական հարուստ ժառանգությունը (զրադաշտական էթիկա, արքայական արդարության տեսություն) իսլամական միստիցիզմի և Շիա իմաստասիրության հետ։",
    centers: [],
    authors: [],
    publications: []
  },
  {
    id: "arb",
    slug: "arabic",
    nameHy: "Արաբական քաղաքակրթություն",
    nameEn: "Arabic Civilization",
    symbol: "☪",
    badge: "Համընդհանուր Ումմա",
    tagline: "«Ումմա» (Միասնական Համայնք) և Բարոյական Մոդեռնիզմ",
    credo: "«Ումմա» (Համընդհանուր Եղբայրություն) և «Վասատիա» (Չափավորություն, Ոսկե Միջին)․ աշխարհակարգ՝ հիմնված աստվածային արդարության, մարդկային արժանապատվության և համամարդկային բարոյական պատասխանատվության վրա։",
    overview: "Արաբական-իսլամական քաղաքակրթությունը ներկայացնում է գիտության, կրոնի և սոցիալական արդարության անխզելի միասնություն։",
    centers: [],
    authors: [],
    publications: []
  },
  {
    id: "grk",
    slug: "greek",
    nameHy: "Հունական քաղաքակրթություն",
    nameEn: "Greek Civilization",
    symbol: "🏛",
    badge: "Օնտոլոգիական Պոլիս",
    tagline: "«Պոլիս» և Օնտոլոգիական Անձ",
    credo: "«Պոլիս» (Համայնքային Ինքնակառավարում) և Անձի Օնտոլոգիա․ աշխարհակարգ՝ հիմնված հավաքական որոշումների, գեղեցկության, ճշմարտության և աստվածային էներգիաների հետ հաղորդակցության վրա։",
    overview: "Հունական քաղաքակրթությունը համաշխարհային մշակույթի գլխավոր հիմնաքարերից է, որը տվել է փիլիսոփայության, դեմոկրատիայի, թատրոնի և բնական գիտությունների դասական կանոնները։",
    centers: [],
    authors: [],
    publications: []
  },
  {
    id: "ind",
    slug: "indian",
    nameHy: "Հնդկական քաղաքակրթություն",
    nameEn: "Indian Civilization",
    symbol: "ॐ",
    badge: "Դհարմայի Տիեզերակարգ",
    tagline: "«Վասուդհայվա Կուտումբակամ» (Ամբողջ Աշխարհը Մեկ Ընտանիք է)",
    credo: "«Դհարմա» (Տիեզերական Բարոյական Կարգ) և «Վասուդհայվա Կուտումբակամ» (Ողջ տիեզերքը մեկ ընտանիք է)․ աշխարհակարգ՝ հիմնված ոչ-բռնության (Ահիմսա), բազմազանության հանդեպ խորին հարգանքի և հոգևոր ինքնակատարելագործման վրա։",
    overview: "Հնդկական քաղաքակրթական ավանդույթը հիմնված է վեդայական, ուպանիշադյան և բուդդայական խոր փիլիսոփայական դպրոցների վրա։",
    centers: [],
    authors: [],
    publications: []
  }
];

export function getAllCivilizations(): Civilization[] {
  return civilizationsData;
}

export function getCivilizationBySlug(slug?: string): Civilization | undefined {
  if (!slug || typeof slug !== "string") return undefined;
  const normalized = slug.toLowerCase().trim();
  return civilizationsData.find(
    (civ) => (civ.slug && civ.slug.toLowerCase() === normalized) || (civ.id && civ.id.toLowerCase() === normalized)
  );
}

export function findCenterById(id?: string): { center: ThinkTank; civ: Civilization } | undefined {
  if (!id || typeof id !== "string") return undefined;
  const normalized = id.toLowerCase().trim();
  for (const civ of civilizationsData) {
    if (civ.centers) {
      const center = civ.centers.find(
        (c) => (c.id && c.id.toLowerCase() === normalized) || (c.name && c.name.toLowerCase() === normalized)
      );
      if (center) return { center, civ };
    }
  }
  return undefined;
}

export function findAuthorById(id?: string): { author: Thinker; civ: Civilization } | undefined {
  if (!id || typeof id !== "string") return undefined;
  const normalized = id.toLowerCase().trim();
  for (const civ of civilizationsData) {
    if (civ.authors) {
      const author = civ.authors.find(
        (a) => (a.id && a.id.toLowerCase() === normalized) || (a.name && a.name.toLowerCase() === normalized)
      );
      if (author) return { author, civ };
    }
    if (civ.centers) {
      for (const center of civ.centers) {
        if (center.authors) {
          const author = center.authors.find(
            (a) => (a.id && a.id.toLowerCase() === normalized) || (a.name && a.name.toLowerCase() === normalized)
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
  pubId?: string
): { pub: Publication; civ: Civilization } | undefined {
  if (!pubId || typeof pubId !== "string") return undefined;
  const normalized = pubId.toLowerCase().trim();
  for (const civ of civilizationsData) {
    if (civ.publications) {
      const pub = civ.publications.find(
        (p) => (p.id && p.id.toLowerCase() === normalized) || (p.title && p.title.toLowerCase() === normalized)
      );
      if (pub) return { pub, civ };
    }
    if (civ.authors) {
      for (const a of civ.authors) {
        if (a.publications) {
          const pub = a.publications.find(
            (p) => (p.id && p.id.toLowerCase() === normalized) || (p.title && p.title.toLowerCase() === normalized)
          );
          if (pub) return { pub, civ };
        }
      }
    }
    if (civ.centers) {
      for (const c of civ.centers) {
        if (c.publications) {
          const pub = c.publications.find(
            (p) => (p.id && p.id.toLowerCase() === normalized) || (p.title && p.title.toLowerCase() === normalized)
          );
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

