import { cn } from "@/lib/utils";

interface BrowserHeaderProps {
  theme: "light" | "dark";
}

export function BrowserHeader({ theme }: BrowserHeaderProps) {
  const isDark = theme === "dark";
  return (
    <div
      className={cn(
        "flex h-10 w-full items-center justify-between border-b px-4 select-none shrink-0 gap-4",
        isDark
          ? "bg-[#1c1c1f] border-zinc-800/80 text-zinc-400"
          : "bg-[#f4f4f5] border-zinc-200/80 text-zinc-500"
      )}
    >
      {/* Windows controls + Back/Forward Navigation */}
      <div className="flex items-center gap-4 w-1/4">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="size-2.5 rounded-full bg-[#ff5f56] hover:opacity-85 transition cursor-pointer" />
          <span className="size-2.5 rounded-full bg-[#ffbd2e] hover:opacity-85 transition cursor-pointer" />
          <span className="size-2.5 rounded-full bg-[#27c93f] hover:opacity-85 transition cursor-pointer" />
        </div>
        
        <div className="hidden sm:flex items-center gap-2 text-muted-foreground/60 shrink-0">
          {/* Back button */}
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="hover:text-foreground cursor-pointer transition">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          {/* Forward button */}
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-30">
            <path d="m9 18 6-6-6-6"/>
          </svg>
          {/* Refresh button */}
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="hover:text-foreground cursor-pointer transition">
            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.72 2.78L21 8"/>
            <path d="M21 3v5h-5"/>
          </svg>
        </div>
      </div>

      {/* Address Bar */}
      <div className="flex items-center justify-center flex-1 max-w-[280px]">
        <div
          className={cn(
            "flex h-6.5 w-full items-center justify-center rounded-md border text-[11px] font-medium tracking-wide shadow-[0_1px_2px_0px_rgba(0,0,0,0.02)] gap-1 px-2.5",
            isDark
              ? "bg-[#09090b] border-zinc-800 text-zinc-400"
              : "bg-white border-zinc-200 text-zinc-500"
          )}
        >
          {/* Lock icon */}
          <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500 shrink-0">
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <span className="opacity-50 text-[10px] shrink-0">https://</span>
          <span className="truncate">yourwebsite.com</span>
        </div>
      </div>

      <div className="w-1/4" />
    </div>
  );
}
