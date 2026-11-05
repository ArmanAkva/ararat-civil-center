export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://araratcivil.org";

export const SITE_NAME = "Արարատյան Ֆորում";

export const DEFAULT_SEO = {
  title: "Արարատյան Ֆորում | Քաղաքակրթական Երկխոսություն",
  titleTemplate: "%s | Արարատյան Ֆորում",
  description:
    "Քաղաքակրթական Երկխոսությունների Արարատյան Ֆորում․ ռազմավարական կենտրոնների, փիլիսոփաների, հետազոտողների և առաջնորդների միջազգային հարթակ։ Գիտական հիմնարար աշխատություններ, հարցադրումներ և բազմաբևեռ աշխարհակարգի տեսլական։",
  keywords: [
    "Արարատյան Ֆորում",
    "Ararat Forum",
    "Քաղաքակրթական Երկխոսություն",
    "Civilizational Dialogue",
    "Արարատյան Կենտրոն",
    "Մատենադարան",
    "Քաղաքակրթություններ",
    "Բազմաբևեռ աշխարհ",
    "Արժեքների երկխոսություն",
    "Գիտական հոդվածներ",
    "Փիլիսոփայություն",
    "Ռազմավարական հետազոտություններ",
    "Գրադարան",
    "Տյանսյա",
    "Միջքաղաքակրթական հարաբերություններ",
  ],
  locale: "hy_AM",
  alternateLocale: "en_US",
};

export function getCanonicalUrl(path = ""): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${cleanPath === "/" ? "" : cleanPath}`;
}

