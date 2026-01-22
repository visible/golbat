"use client"

interface Tab {
  id: string
  label: string
}

interface TabsProps {
  tabs: Tab[]
  active: string
  onChange: (id: string) => void
  size?: "sm" | "md"
}

export default function Tabs({
  tabs,
  active,
  onChange,
  size = "md",
}: TabsProps) {
  const textSize = size === "sm" ? "text-[10px]" : "text-xs"

  return (
    <div className="flex flex-wrap gap-4">
      {tabs.map((tab) => (
        <button
          type="button"
          key={tab.id}
          onMouseDown={() => onChange(tab.id)}
          className={`${textSize} uppercase tracking-[0.15em] transition-colors ${
            active === tab.id
              ? "text-neutral-900 dark:text-white"
              : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
