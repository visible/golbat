import { useState, useEffect } from "react";
import * as cheerio from "cheerio";

type MetadataResponse = {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  ogUrl?: string;
  ogSiteName?: string;
  ogLocale?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterSite?: string;
  twitterCreator?: string;
  canonical?: string;
  favicon?: string;
  charset?: string;
  viewport?: string;
  robots?: string;
  generator?: string;
  themeColor?: string;
  language?: string;
  alternate?: string;
  author?: string;
  prev?: string;
  next?: string;
  search?: string;
  icon?: string;
  [key: string]: string | undefined;
};

interface UseMetadataOptions {
  full?: boolean;
}

interface UseMetadataResult {
  metadata: MetadataResponse | null;
  loading: boolean;
  error: string | null;
  fetch: (url: string) => Promise<void>;
}

const isLocalhostUrl = (url: string): boolean => {
  try {
    const formattedUrl = url.startsWith("http") ? url : `http://${url}`;
    const urlObj = new URL(formattedUrl);
    return urlObj.hostname === "localhost" || urlObj.hostname === "127.0.0.1";
  } catch (error) {
    return false;
  }
};

export function useMetadata(
  initialUrl?: string,
  options: UseMetadataOptions = {}
): UseMetadataResult {
  const [metadata, setMetadata] = useState<MetadataResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(!!initialUrl);
  const [error, setError] = useState<string | null>(null);

  const fetchServerMetadata = async (
    url: string
  ): Promise<MetadataResponse> => {
    const queryParams = new URLSearchParams();
    queryParams.append("url", url);

    if (options.full) {
      queryParams.append("full", "true");
    }

    const response = await fetch(`/api/metadata?${queryParams.toString()}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch metadata");
    }

    return await response.json();
  };

  const fetchClientMetadata = async (
    url: string
  ): Promise<MetadataResponse> => {
    try {
      let response: Response;
      try {
        response = await fetch(url);
      } catch (corsError) {
        throw corsError;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch the URL: ${response.statusText}`);
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      // some very readable code here, thanks claude
      const cleanText = (text: string) => {
        const words = text.split(/\s+/).filter(Boolean);
        return [...new Set(words)].join(" ").trim();
      };

      const metadata: MetadataResponse = {
        title:
          cleanText($("head title").first().text()) ||
          cleanText($("meta[property='og:title']").attr("content") || "") ||
          cleanText($("meta[name='twitter:title']").attr("content") || "") ||
          undefined,
        description: $('meta[name="description"]').attr("content") || undefined,

        ogTitle: $('meta[property="og:title"]').attr("content") || undefined,
        ogDescription:
          $('meta[property="og:description"]').attr("content") || undefined,
        ogImage: $('meta[property="og:image"]').attr("content") || undefined,
        ogType: $('meta[property="og:type"]').attr("content") || undefined,
        ogUrl: $('meta[property="og:url"]').attr("content") || undefined,
        ogSiteName:
          $('meta[property="og:site_name"]').attr("content") || undefined,
        ogLocale: $('meta[property="og:locale"]').attr("content") || undefined,

        twitterCard:
          $('meta[name="twitter:card"]').attr("content") || undefined,
        twitterTitle:
          $('meta[name="twitter:title"]').attr("content") || undefined,
        twitterDescription:
          $('meta[name="twitter:description"]').attr("content") || undefined,
        twitterImage:
          $('meta[name="twitter:image"]').attr("content") || undefined,
        twitterSite:
          $('meta[name="twitter:site"]').attr("content") || undefined,
        twitterCreator:
          $('meta[name="twitter:creator"]').attr("content") || undefined,

        charset:
          $("meta[charset]").attr("charset") ||
          $('meta[http-equiv="Content-Type"]').attr("content") ||
          undefined,
        viewport: $('meta[name="viewport"]').attr("content") || undefined,
        robots: $('meta[name="robots"]').attr("content") || undefined,
        generator: $('meta[name="generator"]').attr("content") || undefined,
        themeColor: $('meta[name="theme-color"]').attr("content") || undefined,
        language: $("html").attr("lang") || undefined,

        canonical: $('link[rel="canonical"]').attr("href") || undefined,
        alternate: $('link[rel="alternate"]').attr("href") || undefined,
        author: $('link[rel="author"]').attr("href") || undefined,
        prev: $('link[rel="prev"]').attr("href") || undefined,
        next: $('link[rel="next"]').attr("href") || undefined,
        search: $('link[rel="search"]').attr("href") || undefined,
        icon: $('link[rel="icon"]').attr("href") || undefined,
      };

      metadata.favicon =
        $(
          'link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"], link[rel="apple-touch-icon-precomposed"], link[rel="mask-icon"], link[rel="fluid-icon"]'
        ).attr("href") || undefined;

      if (options.full) {
        $("meta").each((i, elem) => {
          const name =
            $(elem).attr("name") ||
            $(elem).attr("property") ||
            $(elem).attr("http-equiv");
          const content = $(elem).attr("content");

          if (name && content) {
            const key = name.replace(/[:.]/g, "_");
            metadata[`meta_${key}`] = content;
          }
        });

        $("link").each((i, elem) => {
          const rel = $(elem).attr("rel");
          const href = $(elem).attr("href");

          if (rel && href) {
            const key = rel.replace(/[:.]/g, "_");
            metadata[`link_${key}`] = href;
          }
        });
      }

      try {
        const urlObj = new URL(url);
        const baseUrl = `${urlObj.protocol}//${urlObj.host}`;

        const makeAbsoluteUrl = (
          relativeUrl: string | undefined
        ): string | undefined => {
          if (!relativeUrl) return undefined;
          if (relativeUrl.startsWith("http")) return relativeUrl;
          return relativeUrl.startsWith("/")
            ? `${baseUrl}${relativeUrl}`
            : `${baseUrl}/${relativeUrl}`;
        };

        Object.keys(metadata).forEach((key) => {
          if (
            key.includes("image") ||
            key.includes("icon") ||
            key.includes("url") ||
            key.includes("href") ||
            key.includes("link")
          ) {
            metadata[key] = makeAbsoluteUrl(metadata[key]);
          }
        });
      } catch (e) {
        console.error("Error resolving URLs:", e);
      }

      return metadata;
    } catch (error) {
      console.error("Error in client metadata fetching:", error);
      throw error;
    }
  };

  const fetchMetadata = async (url: string) => {
    if (!url) return;

    setLoading(true);
    setError(null);

    try {
      let formattedUrl = url;
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        // http for localhost, https for everything else
        formattedUrl =
          url.includes("localhost") || url.includes("127.0.0.1")
            ? `http://${url}`
            : `https://${url}`;
      }

      let data: MetadataResponse;

      if (isLocalhostUrl(formattedUrl)) {
        data = await fetchClientMetadata(formattedUrl);
      } else {
        data = await fetchServerMetadata(formattedUrl);
      }

      setMetadata(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      setMetadata(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialUrl) {
      fetchMetadata(initialUrl);
    }
  }, [initialUrl]);

  return {
    metadata,
    loading,
    error,
    fetch: fetchMetadata,
  };
}
