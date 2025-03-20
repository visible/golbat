"use client";

import type React from "react";

import { useState } from "react";
import {
  ArrowRight,
  Copy,
  Check,
  ExternalLink,
  X,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import PlatformPreview from "./platform-preview";
import MetadataItem from "./metadata-item";
import ImagePreview from "./image-preview";
import { useSettings } from "@/hooks/use-settings";
import LocalhostOption from "./localhost-option";

interface MetaData {
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
  [key: string]: string | undefined;
  language?: string;
  charset?: string;
  viewport?: string;
  robots?: string;
  generator?: string;
  themeColor?: string;
  alternate?: string;
  author?: string;
  prev?: string;
  next?: string;
  search?: string;
  icon?: string;
  mobileApp?: string;
  mobileAppUrl?: string;
  appleItunesApp?: string;
  appleMobileWebAppCapable?: string;
  appleMobileWebAppTitle?: string;
  formatDetection?: string;
}

const suggestedUrls: string[] = [
  "vercel.com",
  "github.com",
  "nextjs.org",
  "tailwindcss.com",
];

export default function MetaChecker() {
  const [url, setUrl] = useState("");
  const [metadata, setMetadata] = useState<MetaData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("basic");
  const [activePlatform, setActivePlatform] = useState("telegram");
  const [copied, setCopied] = useState(false);
  const { showSuggestions } = useSettings();

  const fetchMetadata = async (urlToFetch: string) => {
    if (!urlToFetch) {
      setError("Please enter a URL");
      return;
    }

    let formattedUrl = urlToFetch;
    if (
      !urlToFetch.startsWith("http://") &&
      !urlToFetch.startsWith("https://")
    ) {
      formattedUrl = `https://${urlToFetch}`;
    }

    try {
      setLoading(true);
      setError("");
      setMetadata(null);

      const response = await fetch(
        `/api/metadata?url=${encodeURIComponent(formattedUrl)}&full=true`
      ).catch(() => null);

      if (!response || !response.ok) {
        setError(
          "Error fetching metadata. Please check the URL and try again."
        );
        return;
      }

      const data = await response.json().catch(() => null);
      if (!data) {
        setError(
          "Error fetching metadata. Please check the URL and try again."
        );
        return;
      }

      setMetadata(data);
    } catch (err) {
      setError("Error fetching metadata. Please check the URL and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMetadata(url);
  };

  const copyToClipboard = () => {
    if (metadata) {
      navigator.clipboard.writeText(JSON.stringify(metadata, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
          COMMAND
        </div>
        <form onSubmit={handleSubmit} className="flex items-center">
          <span className="mr-2">$</span>
          <div className="flex-1 relative">
            <input
              autoFocus
              autoComplete="off"
              type="text"
              placeholder="Enter URL to inspect (e.g., example.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full py-2 pl-2 pr-16 bg-transparent border-b border-gray-300 dark:border-gray-700 focus:outline-none focus:border-gray-800 dark:focus:border-gray-400 transition-colors"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              {loading ? (
                <div className="h-4 w-4 border-t-2 border-gray-800 dark:border-gray-400 rounded-full animate-spin" />
              ) : (
                <div className="flex items-center gap-2 w-14 justify-end">
                  {url && (
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setUrl("");
                        setMetadata(null);
                        setError("");
                      }}
                      className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                      aria-label="Clear input"
                    >
                      <X size={16} />
                    </button>
                  )}

                  {metadata && (
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        fetchMetadata(url);
                      }}
                      className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                      aria-label="Refresh metadata"
                    >
                      <RefreshCw size={16} />
                    </button>
                  )}

                  {!url && (
                    <button
                      type="submit"
                      disabled={loading || !url}
                      className={`text-gray-500 dark:text-gray-400`}
                      aria-label="Submit"
                    >
                      <ArrowRight size={16} />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </form>
        {error && (
          <div className="mt-3 p-3 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/40 rounded-md flex items-start gap-2">
            <AlertCircle
              size={16}
              className="text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0"
            />
            <div>
              <p className="text-sm font-mono text-red-600 dark:text-red-400">
                {error}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Try adding 'https://' or check if the domain is correct
              </p>
            </div>
          </div>
        )}
      </div>

      {!metadata && !loading && (
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            SUGGESTED
          </div>
          <ul className="space-y-2 text-sm">
            {suggestedUrls.map((suggestedUrl) => (
              <li key={suggestedUrl}>
                <button
                  onMouseDown={() => {
                    setUrl(suggestedUrl);
                    fetchMetadata(suggestedUrl);
                  }}
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center transition-colors"
                >
                  {suggestedUrl} <ArrowRight size={14} className="ml-1" />
                </button>
              </li>
            ))}
            <li>
              <LocalhostOption />
            </li>
          </ul>
        </div>
      )}

      {metadata && (
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            RESULTS
          </div>
          <div className="flex border-b border-gray-200 dark:border-gray-800 mb-6 overflow-x-auto overflow-y-hidden">
            <button
              onMouseDown={() => setActiveTab("basic")}
              className={`px-4 py-2 text-sm ${
                activeTab === "basic"
                  ? "border-b-2 border-gray-800 dark:border-[#444444] font-medium"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              Basic
            </button>
            <button
              onMouseDown={() => setActiveTab("opengraph")}
              className={`px-4 py-2 text-sm ${
                activeTab === "opengraph"
                  ? "border-b-2 border-gray-800 dark:border-[#444444] font-medium"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              Open Graph
            </button>
            <button
              onMouseDown={() => setActiveTab("twitter")}
              className={`px-4 py-2 text-sm ${
                activeTab === "twitter"
                  ? "border-b-2 border-gray-800 dark:border-[#444444] font-medium"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              X
            </button>
            <button
              onMouseDown={() => setActiveTab("images")}
              className={`px-4 py-2 text-sm ${
                activeTab === "images"
                  ? "border-b-2 border-gray-800 dark:border-[#444444] font-medium"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              Images
            </button>
            <button
              onMouseDown={() => setActiveTab("raw")}
              className={`px-4 py-2 text-sm ${
                activeTab === "raw"
                  ? "border-b-2 border-gray-800 dark:border-[#444444] font-medium"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              Raw
            </button>
            <button
              onMouseDown={() => setActiveTab("other")}
              className={`px-4 py-2 text-sm ${
                activeTab === "other"
                  ? "border-b-2 border-gray-800 dark:border-[#444444] font-medium"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              Other
            </button>
          </div>

          {activeTab === "basic" && (
            <div className="space-y-8">
              <div className="bg-white dark:bg-[#111111] rounded-lg border border-gray-100 dark:border-[#222222] overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 dark:bg-[#181818] border-b border-gray-100 dark:border-[#222222]">
                  <h3 className="text-sm font-medium dark:text-[#E0E0E0]">
                    Essential Metadata
                  </h3>
                </div>
                <div className="p-4 space-y-1">
                  {(metadata.favicon || url) && (
                    <div className="flex items-center gap-3 py-2">
                      <div className="text-xs font-medium text-gray-500 dark:text-gray-400 w-32">
                        Favicon
                      </div>
                      <a
                        href={
                          metadata.favicon ||
                          `https://${url.replace(
                            /^https?:\/\//,
                            ""
                          )}/favicon.ico`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block"
                      >
                        <img
                          src={
                            metadata.favicon ||
                            `https://${url.replace(
                              /^https?:\/\//,
                              ""
                            )}/favicon.ico`
                          }
                          alt="Favicon"
                          className="h-6 w-6 border border-gray-100 dark:border-gray-800 rounded hover:opacity-90 transition-opacity"
                          onError={(
                            e: React.SyntheticEvent<HTMLImageElement>
                          ) => {
                            const imgElement = e.target as HTMLImageElement;
                            const parent = imgElement.parentElement;

                            if (url.includes("//")) {
                              const domain = url
                                .replace(/^https?:\/\//, "")
                                .split("/")[0];
                              imgElement.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

                              imgElement.onerror = () => {
                                imgElement.style.display = "none";
                                if (parent) {
                                  const errorMsg =
                                    document.createElement("span");
                                  errorMsg.textContent = "Not available";
                                  errorMsg.className =
                                    "text-gray-500 dark:text-gray-400 text-sm font-mono";
                                  parent.appendChild(errorMsg);
                                }
                              };
                            } else {
                              imgElement.style.display = "none";
                              if (parent) {
                                const errorMsg = document.createElement("span");
                                errorMsg.textContent = "Not available";
                                errorMsg.className =
                                  "text-gray-500 dark:text-gray-400 text-sm font-mono";
                                parent.appendChild(errorMsg);
                              }
                            }
                          }}
                        />
                      </a>
                    </div>
                  )}

                  <div className="group rounded-md -mx-2 p-2 hover:bg-gray-50 dark:hover:bg-[#181818] transition-colors">
                    <div className="flex flex-col sm:flex-row">
                      <div className="text-xs font-medium text-gray-500 dark:text-gray-400 w-full sm:w-32 mb-1 sm:mb-0 sm:pt-0.5">
                        Title
                      </div>
                      <div className="flex-1">
                        <div className="text-sm dark:text-gray-200 break-words">
                          {metadata.title || (
                            <span className="font-mono text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-1.5 py-0.5 rounded border border-red-100 dark:border-red-900/30">
                              Missing
                            </span>
                          )}
                        </div>
                        {metadata.title && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {metadata.title.length} characters
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="group rounded-md -mx-2 p-2 hover:bg-gray-50 dark:hover:bg-[#181818] transition-colors">
                    <div className="flex flex-col sm:flex-row">
                      <div className="text-xs font-medium text-gray-500 dark:text-gray-400 w-full sm:w-32 mb-1 sm:mb-0 sm:pt-0.5">
                        Description
                      </div>
                      <div className="flex-1">
                        <div className="text-sm dark:text-gray-200 break-words">
                          {metadata.description || (
                            <span className="font-mono text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-1.5 py-0.5 rounded border border-red-100 dark:border-red-900/30">
                              Missing
                            </span>
                          )}
                        </div>
                        {metadata.description && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {metadata.description.length} characters
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="group rounded-md -mx-2 p-2 hover:bg-gray-50 dark:hover:bg-[#181818] transition-colors">
                    <div className="flex flex-col sm:flex-row">
                      <div className="text-xs font-medium text-gray-500 dark:text-gray-400 w-full sm:w-32 mb-1 sm:mb-0 sm:pt-0.5">
                        Canonical URL
                      </div>
                      <div className="flex-1 break-words">
                        {metadata.canonical ? (
                          <a
                            href={metadata.canonical}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#444444] dark:text-[#B0B0B0] hover:underline text-sm flex items-center gap-1"
                          >
                            {metadata.canonical}
                            <ExternalLink size={12} />
                          </a>
                        ) : (
                          <span className="font-mono text-amber-500 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-1.5 py-0.5 rounded border border-amber-100 dark:border-amber-900/30 text-sm">
                            Not specified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-[#111111] rounded-lg border border-gray-100 dark:border-[#222222] overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 dark:bg-[#181818] border-b border-gray-100 dark:border-[#222222]">
                  <h3 className="text-sm font-medium dark:text-[#E0E0E0]">
                    Technical Details
                  </h3>
                </div>
                <div className="p-4 space-y-1">
                  <MetadataItem label="Language" value={metadata.language} />
                  <MetadataItem label="Charset" value={metadata.charset} />
                  <MetadataItem label="Viewport" value={metadata.viewport} />
                  <MetadataItem label="Robots" value={metadata.robots} />
                  <MetadataItem label="Generator" value={metadata.generator} />
                  <MetadataItem label="Theme Color" value={metadata.themeColor}>
                    {metadata.themeColor && (
                      <div
                        className="w-4 h-4 inline-block ml-2 border border-gray-300 dark:border-gray-700 rounded-full"
                        style={{ backgroundColor: metadata.themeColor }}
                      />
                    )}
                  </MetadataItem>
                </div>
              </div>

              <div className="bg-white dark:bg-[#111111] rounded-lg border border-gray-100 dark:border-[#222222] overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 dark:bg-[#181818] border-b border-gray-100 dark:border-[#222222]">
                  <h3 className="text-sm font-medium dark:text-[#E0E0E0]">
                    Mobile & App
                  </h3>
                </div>
                <div className="p-4 space-y-1">
                  <MetadataItem label="Mobile App" value={metadata.mobileApp} />
                  <MetadataItem
                    label="Mobile App URL"
                    value={metadata.mobileAppUrl}
                  />
                  <MetadataItem
                    label="Apple iTunes App"
                    value={metadata.appleItunesApp}
                  />
                  <MetadataItem
                    label="Apple Mobile Web App Capable"
                    value={metadata.appleMobileWebAppCapable}
                  />
                  <MetadataItem
                    label="Apple Mobile Web App Title"
                    value={metadata.appleMobileWebAppTitle}
                  />
                  <MetadataItem
                    label="Format Detection"
                    value={metadata.formatDetection}
                  />
                </div>
              </div>

              {showSuggestions && (
                <div className="mt-6 p-4 bg-white dark:bg-[#111111] rounded-lg border border-gray-200 dark:border-[#222222] shadow-sm">
                  <h3 className="text-sm font-medium mb-3 text-black dark:text-[#E0E0E0]">
                    Suggestions
                  </h3>
                  <div className="space-y-3">
                    {/* Title Suggestions */}
                    {!metadata.title ? (
                      <div className="space-y-1">
                        <p className="text-xs text-gray-900 dark:text-[#E0E0E0] flex items-center">
                          <span className="inline-block w-2 h-2 rounded-sm bg-gray-900 dark:bg-[#E0E0E0] mr-2"></span>
                          Missing title tag
                        </p>
                        <p className="text-xs text-gray-500 dark:text-[#888888] pl-4">
                          Add a descriptive title that accurately represents
                          your page content. This is crucial for SEO and social
                          sharing.
                        </p>
                      </div>
                    ) : metadata.title.length < 30 ? (
                      <div className="space-y-1">
                        <p className="text-xs text-gray-900 dark:text-[#E0E0E0] flex items-center">
                          <span className="inline-block w-2 h-2 rounded-sm bg-gray-900 dark:bg-[#E0E0E0] mr-2"></span>
                          Title is too short ({metadata.title.length}{" "}
                          characters)
                        </p>
                        <p className="text-xs text-gray-500 dark:text-[#888888] pl-4">
                          Aim for 50-60 characters to maximize visibility in
                          search results. Your title should be descriptive yet
                          concise.
                        </p>
                      </div>
                    ) : metadata.title.length > 60 ? (
                      <div className="space-y-1">
                        <p className="text-xs text-gray-900 dark:text-[#E0E0E0] flex items-center">
                          <span className="inline-block w-2 h-2 rounded-sm bg-gray-900 dark:bg-[#E0E0E0] mr-2"></span>
                          Title is too long ({metadata.title.length} characters)
                        </p>
                        <p className="text-xs text-gray-500 dark:text-[#888888] pl-4">
                          Keep it under 60 characters to prevent truncation in
                          search results. Focus on the most important keywords.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <p className="text-xs text-gray-900 dark:text-[#E0E0E0] flex items-center">
                          <span className="inline-block w-2 h-2 rotate-45 bg-gray-900 dark:bg-[#E0E0E0] mr-2"></span>
                          Title length is optimal ({metadata.title.length}{" "}
                          characters)
                        </p>
                        <p className="text-xs text-gray-500 dark:text-[#888888] pl-4">
                          Your title is well-optimized for search engines and
                          social sharing.
                        </p>
                      </div>
                    )}

                    {/* Description Suggestions */}
                    {!metadata.description ? (
                      <div className="space-y-1">
                        <p className="text-xs text-gray-900 dark:text-[#E0E0E0] flex items-center">
                          <span className="inline-block w-2 h-2 rounded-sm bg-gray-900 dark:bg-[#E0E0E0] mr-2"></span>
                          Missing meta description
                        </p>
                        <p className="text-xs text-gray-500 dark:text-[#888888] pl-4">
                          Add a compelling description that summarizes your
                          page. This appears in search results and social
                          shares.
                        </p>
                      </div>
                    ) : metadata.description.length < 120 ? (
                      <div className="space-y-1">
                        <p className="text-xs text-gray-900 dark:text-[#E0E0E0] flex items-center">
                          <span className="inline-block w-2 h-2 rounded-sm bg-gray-900 dark:bg-[#E0E0E0] mr-2"></span>
                          Description is too short (
                          {metadata.description.length} characters)
                        </p>
                        <p className="text-xs text-gray-500 dark:text-[#888888] pl-4">
                          Aim for 150-160 characters to provide a comprehensive
                          preview. Include key information and a call to action.
                        </p>
                      </div>
                    ) : metadata.description.length > 160 ? (
                      <div className="space-y-1">
                        <p className="text-xs text-gray-900 dark:text-[#E0E0E0] flex items-center">
                          <span className="inline-block w-2 h-2 rounded-sm bg-gray-900 dark:bg-[#E0E0E0] mr-2"></span>
                          Description is too long ({metadata.description.length}{" "}
                          characters)
                        </p>
                        <p className="text-xs text-gray-500 dark:text-[#888888] pl-4">
                          Keep it under 160 characters to prevent truncation.
                          Place important information at the beginning.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <p className="text-xs text-gray-900 dark:text-[#E0E0E0] flex items-center">
                          <span className="inline-block w-2 h-2 rotate-45 bg-gray-900 dark:bg-[#E0E0E0] mr-2"></span>
                          Description length is optimal (
                          {metadata.description.length} characters)
                        </p>
                        <p className="text-xs text-gray-500 dark:text-[#888888] pl-4">
                          Your description is well-optimized for search
                          visibility and click-through rates.
                        </p>
                      </div>
                    )}

                    {/* Viewport Suggestion */}
                    {!metadata.viewport && (
                      <div className="space-y-1">
                        <p className="text-xs text-gray-900 dark:text-[#E0E0E0] flex items-center">
                          <span className="inline-block w-2 h-2 rounded-sm bg-gray-900 dark:bg-[#E0E0E0] mr-2"></span>
                          Missing viewport meta tag
                        </p>
                        <p className="text-xs text-gray-500 dark:text-[#888888] pl-4">
                          Add{" "}
                          <code className="bg-gray-100 dark:bg-[#181818] px-1.5 py-0.5 rounded text-gray-700 dark:text-[#B0B0B0]">
                            viewport
                          </code>{" "}
                          meta tag for proper mobile rendering. Recommended
                          value:{" "}
                          <code className="bg-gray-100 dark:bg-[#181818] px-1.5 py-0.5 rounded text-gray-700 dark:text-[#B0B0B0]">
                            width=device-width, initial-scale=1
                          </code>
                        </p>
                      </div>
                    )}

                    {/* Canonical URL Suggestion */}
                    {!metadata.canonical && (
                      <div className="space-y-1">
                        <p className="text-xs text-gray-900 dark:text-[#E0E0E0] flex items-center">
                          <span className="inline-block w-2 h-2 rounded-sm bg-gray-900 dark:bg-[#E0E0E0] mr-2"></span>
                          Missing canonical URL
                        </p>
                        <p className="text-xs text-gray-500 dark:text-[#888888] pl-4">
                          Add a canonical URL to prevent duplicate content
                          issues and consolidate SEO value to your preferred
                          URL.
                        </p>
                      </div>
                    )}

                    {/* Language Suggestion */}
                    {!metadata.language && (
                      <div className="space-y-1">
                        <p className="text-xs text-gray-900 dark:text-[#E0E0E0] flex items-center">
                          <span className="inline-block w-2 h-2 rounded-sm bg-gray-900 dark:bg-[#E0E0E0] mr-2"></span>
                          Missing language declaration
                        </p>
                        <p className="text-xs text-gray-500 dark:text-[#888888] pl-4">
                          Add{" "}
                          <code className="bg-gray-100 dark:bg-[#181818] px-1.5 py-0.5 rounded text-gray-700 dark:text-[#B0B0B0]">
                            lang
                          </code>{" "}
                          attribute to your HTML tag for better accessibility
                          and SEO.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "opengraph" && (
            <div className="space-y-8">
              <div className="bg-white dark:bg-[#111111] rounded-lg border border-gray-100 dark:border-[#222222] overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 dark:bg-[#181818] border-b border-gray-100 dark:border-[#222222]">
                  <h3 className="text-sm font-medium dark:text-[#E0E0E0]">
                    Open Graph Basic
                  </h3>
                </div>
                <div className="p-4 space-y-1">
                  <MetadataItem
                    label="OG Title"
                    value={metadata.ogTitle}
                    characterCount
                  />
                  <MetadataItem
                    label="OG Description"
                    value={metadata.ogDescription}
                    characterCount
                  />
                  <MetadataItem
                    label="OG Image"
                    value={metadata.ogImage}
                    isImage
                  />
                </div>
              </div>

              <div className="bg-white dark:bg-[#111111] rounded-lg border border-gray-100 dark:border-[#222222] overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 dark:bg-[#181818] border-b border-gray-100 dark:border-[#222222]">
                  <h3 className="text-sm font-medium dark:text-[#E0E0E0]">
                    Open Graph Additional
                  </h3>
                </div>
                <div className="p-4 space-y-1">
                  <MetadataItem label="OG Type" value={metadata.ogType} />
                  <MetadataItem label="OG URL" value={metadata.ogUrl} />
                  <MetadataItem
                    label="OG Site Name"
                    value={metadata.ogSiteName}
                  />
                  <MetadataItem label="OG Locale" value={metadata.ogLocale} />
                </div>
              </div>

              {showSuggestions && (
                <div className="p-4 bg-gray-50 dark:bg-[#181818] rounded-lg border border-gray-200 dark:border-[#222222] shadow-sm dark:shadow-inner">
                  <h3 className="text-sm font-medium mb-3 text-black dark:text-[#E0E0E0]">
                    Suggestions
                  </h3>
                  <div className="space-y-2">
                    {!metadata.ogTitle ? (
                      <p className="text-xs text-red-500 dark:text-red-400 flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                        Missing og:title. Add Open Graph title.
                      </p>
                    ) : (
                      <p className="text-xs text-green-500 dark:text-green-400 flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                        og:title is present.
                      </p>
                    )}

                    {!metadata.ogDescription ? (
                      <p className="text-xs text-red-500 dark:text-red-400 flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                        Missing og:description. Add Open Graph description.
                      </p>
                    ) : (
                      <p className="text-xs text-green-500 dark:text-green-400 flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                        og:description is present.
                      </p>
                    )}

                    {!metadata.ogImage ? (
                      <p className="text-xs text-red-500 dark:text-red-400 flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                        Missing og:image. Add an Open Graph image.
                      </p>
                    ) : (
                      <p className="text-xs text-green-500 dark:text-green-400 flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                        og:image is present.
                      </p>
                    )}

                    {!metadata.ogType ? (
                      <p className="text-xs text-amber-500 dark:text-amber-400 flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-amber-500 mr-2"></span>
                        Missing og:type. Consider adding a type (e.g., website,
                        article).
                      </p>
                    ) : (
                      <p className="text-xs text-green-500 dark:text-green-400 flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                        og:type is present.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "twitter" && (
            <div className="space-y-8">
              <div className="bg-white dark:bg-[#111111] rounded-lg border border-gray-100 dark:border-[#222222] overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 dark:bg-[#181818] border-b border-gray-800/60">
                  <h3 className="text-sm font-medium dark:text-[#E0E0E0]">
                    X Card
                  </h3>
                </div>
                <div className="p-4 space-y-1">
                  <MetadataItem
                    label="Card Type"
                    value={metadata.twitterCard}
                  />
                  <MetadataItem
                    label="Title"
                    value={metadata.twitterTitle}
                    characterCount
                  />
                  <MetadataItem
                    label="Description"
                    value={metadata.twitterDescription}
                    characterCount
                  />
                  <MetadataItem
                    label="Image"
                    value={metadata.twitterImage}
                    isImage
                  />
                </div>
              </div>

              {showSuggestions && (
                <div className="p-4 bg-gray-50 dark:bg-[#181818] rounded-lg border border-gray-200 dark:border-[#222222] shadow-sm dark:shadow-inner">
                  <h3 className="text-sm font-medium mb-3 text-black dark:text-[#E0E0E0]">
                    Suggestions
                  </h3>
                  <div className="space-y-2">
                    {!metadata.twitterCard ? (
                      <p className="text-xs text-red-500 dark:text-red-400 flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                        Missing twitter:card. Add a card type.
                      </p>
                    ) : (
                      <p className="text-xs text-green-500 dark:text-green-400 flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                        twitter:card is present.
                      </p>
                    )}

                    {!metadata.twitterTitle ? (
                      <p className="text-xs text-amber-500 dark:text-amber-400 flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-amber-500 mr-2"></span>
                        Missing twitter:title. Falling back to og:title.
                      </p>
                    ) : (
                      <p className="text-xs text-green-500 dark:text-green-400 flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                        twitter:title is present.
                      </p>
                    )}

                    {!metadata.twitterImage ? (
                      <p className="text-xs text-amber-500 dark:text-amber-400 flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-amber-500 mr-2"></span>
                        Missing twitter:image. Falling back to og:image.
                      </p>
                    ) : (
                      <p className="text-xs text-green-500 dark:text-green-400 flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                        twitter:image is present.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "images" && (
            <div className="space-y-6">
              {metadata.ogImage && (
                <ImagePreview title="Open Graph Image" url={metadata.ogImage} />
              )}
              {metadata.twitterImage && (
                <ImagePreview title="X Image" url={metadata.twitterImage} />
              )}
              {metadata.favicon && (
                <ImagePreview title="Favicon" url={metadata.favicon} />
              )}
              {!metadata.ogImage &&
                !metadata.twitterImage &&
                !metadata.favicon && (
                  <div className="p-4 bg-gray-50 dark:bg-[#181818] rounded-md border border-gray-200 dark:border-[#222222] text-center">
                    <p className="text-gray-500 dark:text-gray-400 font-mono text-sm">
                      No images found in metadata
                    </p>
                  </div>
                )}

              {showSuggestions && (
                <div className="mt-6 p-3 bg-gray-50 dark:bg-[#181818] rounded-md border border-gray-200 dark:border-[#222222] shadow-sm dark:shadow-inner">
                  <h3 className="text-sm font-medium mb-2 text-black dark:text-[#E0E0E0]">
                    Suggestions
                  </h3>
                  {!metadata.ogImage && !metadata.twitterImage ? (
                    <p className="text-xs text-red-500 dark:text-red-400">
                      No social media images found. Add og:image and
                      twitter:image.
                    </p>
                  ) : (
                    <p className="text-xs text-green-500 dark:text-green-400">
                      Social media images are present.
                    </p>
                  )}

                  {!metadata.favicon ? (
                    <p className="text-xs text-amber-500 dark:text-amber-400">
                      No favicon detected. Add a favicon for better brand
                      recognition.
                    </p>
                  ) : (
                    <p className="text-xs text-green-500 dark:text-green-400">
                      Favicon is present.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "raw" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium dark:text-gray-200">
                  Complete Metadata
                </h3>
                <button
                  onMouseDown={copyToClipboard}
                  className="text-xs px-3 py-1.5 bg-gray-200 dark:bg-[#181818] rounded hover:bg-gray-300 dark:hover:bg-[#222222] transition-colors flex items-center gap-1.5 group"
                >
                  {copied ? (
                    <>
                      <Check size={14} className="text-green-500" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy
                        size={14}
                        className="group-hover:text-[#444444] transition-colors"
                      />
                      <span>Copy to Clipboard</span>
                    </>
                  )}
                </button>
              </div>
              <div className="bg-gray-100 dark:bg-[#111111] p-4 rounded-md overflow-auto max-h-[500px] border border-gray-200 dark:border-[#222222] shadow-sm dark:shadow-inner">
                <pre className="text-xs text-black dark:text-gray-300 whitespace-pre-wrap">
                  {JSON.stringify(metadata, null, 2)}
                </pre>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                <span className="font-medium">Tip:</span> Use the copy button to
                export this data for further analysis.
              </div>
            </div>
          )}

          {activeTab === "other" && (
            <div>
              <div className="flex border-b border-gray-200 dark:border-gray-800 mb-4 overflow-x-auto">
                <button
                  onMouseDown={() => setActivePlatform("telegram")}
                  className={`px-3 py-1 text-xs ${
                    activePlatform === "telegram"
                      ? "border-b border-gray-800 dark:border-[#444444] font-medium"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  Telegram
                </button>
                <button
                  onMouseDown={() => setActivePlatform("discord")}
                  className={`px-3 py-1 text-xs ${
                    activePlatform === "discord"
                      ? "border-b border-gray-800 dark:border-[#444444] font-medium"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  Discord
                </button>
                <button
                  onMouseDown={() => setActivePlatform("whatsapp")}
                  className={`px-3 py-1 text-xs ${
                    activePlatform === "whatsapp"
                      ? "border-b border-gray-800 dark:border-[#444444] font-medium"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  WhatsApp
                </button>
                <button
                  onMouseDown={() => setActivePlatform("slack")}
                  className={`px-3 py-1 text-xs ${
                    activePlatform === "slack"
                      ? "border-b border-gray-800 dark:border-[#444444] font-medium"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  Slack
                </button>
                <button
                  onMouseDown={() => setActivePlatform("facebook")}
                  className={`px-3 py-1 text-xs ${
                    activePlatform === "facebook"
                      ? "border-b border-gray-800 dark:border-[#444444] font-medium"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  Facebook
                </button>
                <button
                  onMouseDown={() => setActivePlatform("twitter")}
                  className={`px-3 py-1 text-xs ${
                    activePlatform === "twitter"
                      ? "border-b border-gray-800 dark:border-[#444444] font-medium"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  X
                </button>
                <button
                  onMouseDown={() => setActivePlatform("linkedin")}
                  className={`px-3 py-1 text-xs ${
                    activePlatform === "linkedin"
                      ? "border-b border-gray-800 dark:border-[#444444] font-medium"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  LinkedIn
                </button>
              </div>

              <div className="mt-4">
                <PlatformPreview
                  platform={activePlatform}
                  metadata={metadata}
                  url={url}
                />

                {showSuggestions && (
                  <div className="mt-6 p-3 bg-gray-50 dark:bg-[#181818] rounded-md border border-gray-200 dark:border-[#222222] shadow-sm dark:shadow-inner">
                    <h3 className="text-sm font-medium mb-2 text-black dark:text-[#E0E0E0]">
                      Suggestions
                    </h3>
                    {activePlatform === "twitter" && !metadata.twitterCard ? (
                      <p className="text-xs text-red-500 dark:text-red-400">
                        Missing twitter:card. Add a card type for better
                        display.
                      </p>
                    ) : activePlatform === "facebook" && !metadata.ogImage ? (
                      <p className="text-xs text-red-500 dark:text-red-400">
                        Missing og:image. Facebook requires an image for better
                        sharing.
                      </p>
                    ) : activePlatform === "linkedin" && !metadata.ogTitle ? (
                      <p className="text-xs text-red-500 dark:text-red-400">
                        Missing og:title. LinkedIn requires a title for better
                        sharing.
                      </p>
                    ) : (
                      <p className="text-xs text-green-500 dark:text-green-400">
                        Metadata for {activePlatform} looks good!
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
