import { Github } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"
import Background from "@/components/background"
import Checker from "@/components/checker"
import Logo from "@/components/logo"
import Theme from "@/components/theme"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Background />
      <header className="w-full">
        <div className="max-w-2xl mx-auto px-6 h-14 flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-60 transition-opacity"
          >
            <Logo size={18} />
            <span className="text-xs tracking-[0.15em] uppercase">golb.at</span>
          </Link>
          <div className="flex items-center gap-1">
            <Theme />
            <Link
              href="https://github.com/visible/golbat"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col justify-center">
        <div className="max-w-2xl mx-auto px-6 w-full py-12 md:py-16">
          <Suspense fallback={<CheckerSkeleton />}>
            <Checker />
          </Suspense>
        </div>
      </main>

      <footer className="w-full">
        <div className="max-w-2xl mx-auto px-6 h-14 flex justify-between items-center text-[10px] text-neutral-400 uppercase tracking-[0.15em]">
          <span>metadata inspector</span>
          <Link
            href="https://vercel.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
          >
            <svg
              height="9"
              viewBox="0 0 76 65"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
            </svg>
          </Link>
        </div>
      </footer>
    </div>
  )
}

function CheckerSkeleton() {
  return (
    <div className="w-full">
      <div className="mb-8">
        <div className="h-12 w-48 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
        <div className="mt-3 h-4 w-64 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
      </div>
      <div className="h-11 w-full bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
    </div>
  )
}
