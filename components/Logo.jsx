import Image from 'next/image';
import Link from "next/link";

export default function Logo({ className = "", href = "/", imgClassName = "", prefetchLinks = null }) {
  return (
    <Link prefetch={prefetchLinks} href={href} className={`inline-flex items-center ${className}`.trim()}>
      <Image
        src="/site-logo.webp"
        width={1000}
        height={1000}
        decoding="async"
        sizes="(min-width: 1280px) 460px, (min-width: 1024px) 424px, (min-width: 640px) 120px, 220px"
        preload
        alt="Pick It Up Seattle"
        className={`block h-auto w-44 max-w-full object-contain ${imgClassName}`.trim()}
      />
    </Link>
  );
}