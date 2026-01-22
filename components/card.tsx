interface CardProps {
  title: string
  children: React.ReactNode
}

export default function Card({ title, children }: CardProps) {
  return (
    <div className="border border-[#222] rounded-lg overflow-hidden">
      <div className="px-4 py-3 bg-[#111] border-b border-[#222]">
        <h3 className="text-sm font-medium">{title}</h3>
      </div>
      <div className="p-4 space-y-1">{children}</div>
    </div>
  )
}
