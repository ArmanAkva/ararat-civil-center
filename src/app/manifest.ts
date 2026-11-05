import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Արարատյան Ֆորում | Քաղաքակրթական Երկխոսություն",
    short_name: "Արարատյան Ֆորում",
    description:
      "Քաղաքակրթական Երկխոսությունների Արարատյան Ֆորում․ ռազմավարական կենտրոններ, հիմնարար աշխատություններ, գիտական հետազոտություններ և առաջնորդների երկխոսություն։",
    start_url: "/",
    display: "standalone",
    background_color: "#0b0f17",
    theme_color: "#1e293b",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}

