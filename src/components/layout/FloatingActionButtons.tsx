import Link from "next/link";

const sharedClass =
  "shine-sweep relative flex h-44 w-16 items-center justify-center overflow-hidden rounded-l-md text-base font-semibold text-white font-serif shadow-lg transition-colors";

const LINE_LETTERS = ["L", "I", "N", "E"] as const;
const BOOKING_CHARS = ["予", "約", "す", "る"] as const;

export function FloatingActionButtons() {
  return (
    <div className="fixed top-1/2 right-0 z-50 flex -translate-y-1/2 flex-col gap-1.5">
      <Link href="/booking" className={`${sharedClass} bg-red-600 hover:bg-red-700`}>
        <span className="flex flex-col items-center gap-4 leading-none">
          {BOOKING_CHARS.map((char) => (
            <span key={char} className="block w-full text-center">
              {char}
            </span>
          ))}
        </span>
      </Link>
      <Link href="/line" className={`${sharedClass} bg-[#06C755] hover:bg-[#05A94A]`}>
        <span className="flex flex-col items-center gap-4 leading-none">
          {LINE_LETTERS.map((char) => (
            <span key={char} className="block w-full text-center">
              {char}
            </span>
          ))}
        </span>
      </Link>
    </div>
  );
}
