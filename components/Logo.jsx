import Link from 'next/link';

export default function Logo({ className = '', href = '/', showText = true }) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-3 ${className}`.trim()}
      aria-label="Pick It Up Seattle home"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-[1.1rem] bg-[#0f2b45] shadow-[0_12px_28px_rgba(15,43,69,0.22)] sm:h-14 sm:w-14">
        <svg viewBox="0 0 64 64" className="h-7 w-7 sm:h-8 sm:w-8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 27c0-8 6-12 13-12 8 0 14 5 14 13 0 9-8 16-15 19-6-3-12-10-12-20Z" fill="#f8c948" />
          <path d="M24 17c5-2 9-2 13 1-3 4-5 8-7 14-3-3-5-7-6-15Z" fill="#7bcf8b" />
          <path d="M27 29c3 0 6 2 8 5-4 1-8 2-12 4 1-4 2-7 4-9Z" fill="#6db6d9" />
          <path d="M40 21c3 2 5 5 6 8-3-1-6-1-9-1 1-3 2-5 3-7Z" fill="#ffffff" opacity="0.9" />
        </svg>
      </span>
      {showText ? (
        <span className="flex flex-col leading-none">
          <span className="text-[0.95rem] font-black uppercase tracking-[0.24em] text-[#0f2b45] sm:text-[1.05rem]">
            Pick It Up
          </span>
          <span className="mt-1 text-[0.8rem] font-semibold uppercase tracking-[0.32em] text-[#1f5f7a] sm:text-[0.9rem]">
            Seattle
          </span>
        </span>
      ) : null}
    </Link>
  );
}
