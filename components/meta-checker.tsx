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
import { useMetadata } from "@/hooks/use-metadata";
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
  const [activeTab, setActiveTab] = useState("basic");
  const [activePlatform, setActivePlatform] = useState("telegram");
  const [copied, setCopied] = useState(false);
  const { showSuggestions } = useSettings();
  const {
    metadata,
    loading,
    error: metadataError,
    fetch: fetchMetadata,
  } = useMetadata(undefined, { full: true });
  const error = metadataError || "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) {
      return;
    }
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
                        // No need to manually clear metadata here, managed by hook
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
          </ul>
        </div>
      )}

      {metadata && (
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            RESULT
          </div>
          <div className="mb-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-xl font-bold mb-1">
                  {metadata.title || "No Title"}
                </h1>
                {metadata.ogSiteName && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {metadata.ogSiteName}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onMouseDown={copyToClipboard}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  aria-label={copied ? "Copied" : "Copy JSON"}
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
                {metadata.canonical && (
                  <a
                    href={metadata.canonical}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    aria-label="Visit website"
                  >
                    <ExternalLink size={18} />
                  </a>
                )}
              </div>
            </div>

            <div className="mt-4">
              <div className="flex border-b border-gray-200 dark:border-gray-800">
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === "basic"
                      ? "text-gray-900 dark:text-white border-b-2 border-gray-900 dark:border-white"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                  onClick={() => setActiveTab("basic")}
                >
                  Basic
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === "preview"
                      ? "text-gray-900 dark:text-white border-b-2 border-gray-900 dark:border-white"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                  onClick={() => setActiveTab("preview")}
                >
                  Preview
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === "all"
                      ? "text-gray-900 dark:text-white border-b-2 border-gray-900 dark:border-white"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                  onClick={() => setActiveTab("all")}
                >
                  All Data
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
                                    const errorMsg =
                                      document.createElement("span");
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
                      <MetadataItem
                        label="Language"
                        value={metadata.language}
                      />
                      <MetadataItem label="Charset" value={metadata.charset} />
                      <MetadataItem
                        label="Viewport"
                        value={metadata.viewport}
                      />
                      <MetadataItem label="Robots" value={metadata.robots} />
                      <MetadataItem
                        label="Generator"
                        value={metadata.generator}
                      />
                      <MetadataItem
                        label="Theme Color"
                        value={metadata.themeColor}
                      >
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
                      <MetadataItem
                        label="Mobile App"
                        value={metadata.mobileApp}
                      />
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
                              your page content. This is crucial for SEO and
                              social sharing.
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
                              search results. Your title should be descriptive
                              yet concise.
                            </p>
                          </div>
                        ) : metadata.title.length > 60 ? (
                          <div className="space-y-1">
                            <p className="text-xs text-gray-900 dark:text-[#E0E0E0] flex items-center">
                              <span className="inline-block w-2 h-2 rounded-sm bg-gray-900 dark:bg-[#E0E0E0] mr-2"></span>
                              Title is too long ({metadata.title.length}{" "}
                              characters)
                            </p>
                            <p className="text-xs text-gray-500 dark:text-[#888888] pl-4">
                              Keep it under 60 characters to prevent truncation
                              in search results. Focus on the most important
                              keywords.
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
                              Your title is well-optimized for search engines
                              and social sharing.
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
                              Aim for 150-160 characters to provide a
                              comprehensive preview. Include key information and
                              a call to action.
                            </p>
                          </div>
                        ) : metadata.description.length > 160 ? (
                          <div className="space-y-1">
                            <p className="text-xs text-gray-900 dark:text-[#E0E0E0] flex items-center">
                              <span className="inline-block w-2 h-2 rounded-sm bg-gray-900 dark:bg-[#E0E0E0] mr-2"></span>
                              Description is too long (
                              {metadata.description.length} characters)
                            </p>
                            <p className="text-xs text-gray-500 dark:text-[#888888] pl-4">
                              Keep it under 160 characters to prevent
                              truncation. Place important information at the
                              beginning.
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
                              attribute to your HTML tag for better
                              accessibility and SEO.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {activeTab === "preview" && (
            <div className="space-y-8">
              <div className="bg-white dark:bg-[#111111] rounded-lg border border-gray-100 dark:border-[#222222] overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 dark:bg-[#181818] border-b border-gray-100 dark:border-[#222222]">
                  <h3 className="text-sm font-medium dark:text-[#E0E0E0]">
                    Preview
                  </h3>
                </div>
                <div className="p-4 space-y-1">
                  <MetadataItem
                    label="Title"
                    value={metadata.title}
                    characterCount
                  />
                  <MetadataItem
                    label="Description"
                    value={metadata.description}
                    characterCount
                  />
                  <MetadataItem
                    label="Canonical URL"
                    value={metadata.canonical}
                  />
                  <MetadataItem label="Favicon" value={metadata.favicon} />
                </div>
              </div>

              <div className="mt-4">
                <PlatformPreview
                  platform={activePlatform}
                  metadata={metadata}
                  url={url}
                />
              </div>
            </div>
          )}

          {activeTab === "all" && (
            <div className="space-y-8">
              <div className="bg-white dark:bg-[#111111] rounded-lg border border-gray-100 dark:border-[#222222] overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 dark:bg-[#181818] border-b border-gray-100 dark:border-[#222222]">
                  <h3 className="text-sm font-medium dark:text-[#E0E0E0]">
                    Complete Metadata
                  </h3>
                </div>
                <div className="p-4 space-y-1">
                  <MetadataItem
                    label="Title"
                    value={metadata.title}
                    characterCount
                  />
                  <MetadataItem
                    label="Description"
                    value={metadata.description}
                    characterCount
                  />
                  <MetadataItem
                    label="Canonical URL"
                    value={metadata.canonical}
                  />
                  <MetadataItem label="Favicon" value={metadata.favicon} />
                </div>
              </div>

              <div className="bg-white dark:bg-[#111111] rounded-lg border border-gray-100 dark:border-[#222222] overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 dark:bg-[#181818] border-b border-gray-100 dark:border-[#222222]">
                  <h3 className="text-sm font-medium dark:text-[#E0E0E0]">
                    Open Graph
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
                    Twitter
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
            </div>
          )}
        </div>
      )}
    </div>
  );
}
