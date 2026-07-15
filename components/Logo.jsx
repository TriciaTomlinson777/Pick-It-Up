import Link from "next/link";

export default function Logo({ className = "", href = "/" }) {
  return (
    <Link href={href} className={`inline-flex items-center ${className}`.trim()}>
      <img
        src="/pick-it-up-seattle-logo.png"
        alt="Pick It Up Seattle"
        className="h-auto w-44 max-w-full"
      />
    </Link>
  );
}