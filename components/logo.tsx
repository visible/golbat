interface LogoProps {
  size?: number
  className?: string
}

export default function Logo({ size = 16, className }: LogoProps) {
  return (
    <span
      aria-hidden="true"
      className={className ?? "text-neutral-900 dark:text-white"}
      style={{ fontSize: size }}
    >
      ཐི༏ཋྀ
    </span>
  )
}
