"use client"

import { ArrowUp, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import type { MetaData } from "@/hooks/metadata"
import Logo from "./logo"

interface ChatProps {
  metadata: MetaData
  url: string
}

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

function formatInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/)
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <span key={i} className="font-medium text-neutral-900 dark:text-white">
          {part.slice(2, -2)}
        </span>
      )
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return (
        <span key={i} className="italic">
          {part.slice(1, -1)}
        </span>
      )
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="px-1 py-0.5 bg-neutral-200 dark:bg-neutral-800 rounded text-xs"
        >
          {part.slice(1, -1)}
        </code>
      )
    }
    return part
  })
}

function formatContent(content: string) {
  return content.split("\n").map((line, i) => {
    if (line.startsWith("- ") || line.startsWith("• ")) {
      return (
        <div key={i} className="flex mt-1.5">
          <span className="text-neutral-400 shrink-0 w-6">↘</span>
          <span className="flex-1">{formatInline(line.slice(2))}</span>
        </div>
      )
    }
    if (line.startsWith("  - ") || line.startsWith("  • ")) {
      return (
        <div key={i} className="flex mt-1 ml-6">
          <span className="text-neutral-400 shrink-0 w-6">↘</span>
          <span className="flex-1">{formatInline(line.slice(4))}</span>
        </div>
      )
    }
    if (line.match(/^\d+\.\s/)) {
      const num = line.match(/^\d+/)?.[0]
      const text = line.replace(/^\d+\.\s/, "")
      return (
        <div key={i} className="flex mt-3 first:mt-0">
          <span className="text-neutral-400 shrink-0 w-6">{num}.</span>
          <span className="flex-1">{formatInline(text)}</span>
        </div>
      )
    }
    if (line.trim() === "") {
      return <div key={i} className="h-3" />
    }
    return (
      <div key={i} className="mt-1 first:mt-0">
        {formatInline(line)}
      </div>
    )
  })
}

export default function Chat({ metadata, url }: ChatProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const suggestions = ["Analyze", "What's missing?", "Improve"]

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          metadata,
          url,
        }),
      })

      if (!response.ok) throw new Error("Failed to send message")

      const reader = response.body?.getReader()
      if (!reader) throw new Error("No response body")

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
      }

      setMessages((prev) => [...prev, assistantMessage])

      const decoder = new TextDecoder()
      let done = false

      while (!done) {
        const { value, done: readerDone } = await reader.read()
        done = readerDone

        if (value) {
          const chunk = decoder.decode(value)
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMessage.id
                ? { ...m, content: m.content + chunk }
                : m,
            ),
          )
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Something went wrong. Please try again.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  return (
    <>
      <button
        type="button"
        onMouseDown={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-10 h-10 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform z-50"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <X size={16} aria-hidden="true" />
        ) : (
          <Logo size={16} className="text-current" />
        )}
      </button>

      <div
        className={`fixed bottom-20 right-6 w-[400px] bg-[#f8f7f4] dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl z-50 overflow-hidden transition-all duration-300 ease-out origin-bottom-right ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-2 pointer-events-none"
        }`}
      >
        <div className="px-5 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="text-[10px] text-neutral-400 uppercase tracking-[0.15em]">
            Ask AI
          </div>
          {messages.length > 0 && (
            <button
              type="button"
              onMouseDown={() => setMessages([])}
              className="text-[10px] text-neutral-400 hover:text-neutral-900 dark:hover:text-white uppercase tracking-[0.1em] transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        <div className="h-96 overflow-y-auto p-5 scrollbar-none">
          {messages.length === 0 ? (
            <div className="space-y-4">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Ask about your metadata
              </p>
              <div className="flex flex-wrap gap-3">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onMouseDown={() => sendMessage(suggestion)}
                    className="text-[10px] uppercase tracking-[0.1em] text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    ↘ {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {messages.map((message) => (
                <div key={message.id}>
                  <div className="text-[10px] text-neutral-400 uppercase tracking-[0.1em] mb-1.5">
                    {message.role === "user" ? "You" : "AI"}
                  </div>
                  <div
                    className={`text-sm leading-relaxed ${
                      message.role === "user"
                        ? "text-neutral-900 dark:text-white"
                        : "text-neutral-600 dark:text-neutral-300"
                    }`}
                  >
                    {message.role === "assistant"
                      ? formatContent(message.content)
                      : message.content}
                  </div>
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div>
                  <div className="text-[10px] text-neutral-400 uppercase tracking-[0.1em] mb-1.5">
                    AI
                  </div>
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" />
                    <span
                      className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <span
                      className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="px-5 py-4 border-t border-neutral-200 dark:border-neutral-800"
        >
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
              className="w-full h-9 px-0 pr-8 bg-transparent border-b border-neutral-300 dark:border-neutral-700 text-sm placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 dark:focus:border-white transition-colors"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white disabled:opacity-30 transition-colors"
            >
              <ArrowUp size={14} aria-hidden="true" />
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
