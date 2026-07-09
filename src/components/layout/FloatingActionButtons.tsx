import Link from "next/link";
import { LINE_URL } from "@/lib/nav";

const buttonClass =
  "flex w-28 items-center justify-center rounded-l-md bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-red-700";

export function FloatingActionButtons() {
  const lineHref = LINE_URL || "/contact";

  return (
    <div className="fixed top-1/2 right-0 z-50 flex -translate-y-1/2 flex-col gap-1">
      <Link href="/booking" className={buttonClass}>
        予約する
      </Link>
      <a
        href={lineHref}
        target={LINE_URL ? "_blank" : undefined}
        rel={LINE_URL ? "noopener noreferrer" : undefined}
        className={buttonClass}
      >
        LINE
      </a>
    </div>
  );
}
