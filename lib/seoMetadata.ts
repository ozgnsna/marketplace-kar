import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/site";

type PageSeoInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  /** true: template eklenmez (ana sayfa için). */
  absolute?: boolean;
};

export function pageMetadata({
  title,
  description,
  path,
  keywords,
  absolute = false,
}: PageSeoInput): Metadata {
  const url = new URL(path === "/" ? "/" : path, SITE_URL).toString();
  return {
    title: absolute ? { absolute: title } : title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "tr_TR",
      url,
      siteName: SITE_NAME,
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
