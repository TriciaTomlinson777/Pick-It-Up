import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CaptainCanStorybookReader from '@/components/CaptainCanStorybookReader';

const CAPTAIN_CAN_PDF_HREF = '/Captain_Can_and_the_Messy_Block_EMAIL_SMALL.pdf';
const CAPTAIN_CAN_COVER_SRC = '/Captain Can VS3 Book Cover.jpg';

// Each letter gets its own bright brand color to keep the heading playful.
const KIDS_CORNER_TITLE_LETTERS = [
  { char: 'K', color: '#0f9aa1' },
  { char: 'i', color: '#f59a2d' },
  { char: 'd', color: '#69be28' },
  { char: 's', color: '#f4c94c' },
  { char: ' ', color: null },
  { char: 'C', color: '#ef7f2d' },
  { char: 'o', color: '#2ec4c7' },
  { char: 'r', color: '#61b826' },
  { char: 'n', color: '#0fa5af' },
  { char: 'e', color: '#1fb8c2' },
  { char: 'r', color: '#d9665b' },
];

export default function KidsCorner() {
  return (
    <>
      <Header />

      <main className="bg-[#fdf7e8] text-[#002244]">
        <section className="hero-surface border-b border-[#0f9aa1]/20 py-14 sm:py-20">
          <div className="container-custom text-center">
            <h1 className="flex flex-col items-center gap-1">
              <span className="text-2xl font-semibold text-[#002244] sm:text-3xl">Welcome to</span>
              <span className="flex flex-wrap justify-center text-5xl font-extrabold sm:text-6xl lg:text-7xl">
                {KIDS_CORNER_TITLE_LETTERS.map((letter, index) =>
                  letter.char === ' ' ? (
                    <span key={index}>&nbsp;</span>
                  ) : (
                    <span key={index} style={{ color: letter.color }}>
                      {letter.char}
                    </span>
                  )
                )}
                <span className="text-[#002244]">!</span>
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-[1.1rem] font-medium leading-relaxed text-slate-800 sm:text-[1.2rem]">
              Small actions can make a big difference. Meet Mia, Captain Can, and the Mess
              Monster&mdash;and discover how one person and one piece can help make Seattle better.
            </p>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="container-custom px-6 py-10 sm:px-12 sm:py-12">
            <p className="text-center text-sm font-bold uppercase tracking-[0.18em] text-[#0f9aa1]">
              Our First Children&apos;s Book
            </p>

            <div className="mt-8 grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-4">
              <div className="mx-auto w-full max-w-[280px] overflow-hidden rounded-[1.5rem] shadow-[0_20px_45px_rgba(0,34,68,0.28)]">
                <Image
                  src={CAPTAIN_CAN_COVER_SRC}
                  alt="Captain Can and the Messy Block book cover"
                  width={560}
                  height={745}
                  className="h-auto w-full"
                  priority
                />
              </div>

              {/* Description + actions */}
              <div className="text-center lg:text-left">
                <h2 className="heading-md text-[#002b49]">Captain Can and the Messy Block</h2>
                <p className="mt-4 text-[1.05rem] font-medium leading-relaxed text-slate-800">
                  Join Mia and her super-powered sidekick, Captain Can, as they team up to take on
                  the mischievous Mess Monster and clean up their block&mdash;one piece of litter
                  at a time.
                </p>

                <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
                  <CaptainCanStorybookReader />
                  <a
                    href={CAPTAIN_CAN_PDF_HREF}
                    download
                    className="btn-orange w-full sm:w-auto"
                  >
                    Download &amp; Print
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
