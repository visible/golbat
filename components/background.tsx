"use client"

import { cn } from "@/lib/utils"

export default function Background() {
  return (
    <>
      <div
        className="fixed inset-0 -z-10 hidden dark:block overflow-hidden"
        aria-hidden="true"
      >
        <div
          className={cn(
            "pointer-events-none absolute -inset-[10px] opacity-50 blur-[10px] will-change-transform",
            "animate-aurora",
            "[background-image:repeating-linear-gradient(100deg,#000_0%,#000_7%,transparent_10%,transparent_12%,#000_16%),repeating-linear-gradient(100deg,#3b82f6_10%,#a5b4fc_15%,#93c5fd_20%,#ddd6fe_25%,#60a5fa_30%)]",
            "[background-size:300%,_200%]",
            "[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,transparent_70%)]"
          )}
        />
      </div>

      <div
        className="fixed inset-0 -z-10 block dark:hidden overflow-hidden"
        aria-hidden="true"
      >
        <div
          className={cn(
            "pointer-events-none absolute -inset-[10px] opacity-30 blur-[10px] invert filter will-change-transform",
            "animate-aurora",
            "[background-image:repeating-linear-gradient(100deg,#fff_0%,#fff_7%,transparent_10%,transparent_12%,#fff_16%),repeating-linear-gradient(100deg,#3b82f6_10%,#a5b4fc_15%,#93c5fd_20%,#ddd6fe_25%,#60a5fa_30%)]",
            "[background-size:300%,_200%]",
            "[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,transparent_70%)]"
          )}
        />
      </div>
    </>
  )
}
