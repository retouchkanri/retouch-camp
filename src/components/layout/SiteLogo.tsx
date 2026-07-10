import Image from "next/image";
import Link from "next/link";

const LOGO_SRC = "/logo.png";

export function SiteLogo({
  className = "h-10 w-auto",
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={LOGO_SRC}
      alt="Retouch Horse Garden"
      width={320}
      height={128}
      priority={priority}
      className={className}
    />
  );
}

export function SiteLogoLink({
  className = "h-10 w-auto sm:h-11",
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Link href="/" className="inline-flex shrink-0 items-center" onClick={onClick}>
      <SiteLogo className={className} priority />
    </Link>
  );
}
