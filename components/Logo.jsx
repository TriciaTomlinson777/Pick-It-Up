import Link from "next/link";

export default function Logo({ className = "", href = "/", imgClassName = "" }) {
  return (
    <Link href={href} className={`inline-flex items-center ${className}`.trim()}>
      <img
        src="/site-logo.webp"
        width={1000}
        height={1000}
        decoding="async"
        alt="Pick It Up Seattle"
        className={`block h-auto w-44 max-w-full object-contain ${imgClassName}`.trim()}
      />
    </Link>
  );
}