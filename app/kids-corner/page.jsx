import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CaptainCanStorybookReader from '@/components/CaptainCanStorybookReader';

const CAPTAIN_CAN_PDF_HREF = '/Captain_Can_and_the_Messy_Block_EMAIL_SMALL.pdf';
const CAPTAIN_CAN_COVER_SRC = '/Captain Can VS3 Book Cover.jpg';

const BOOK_CARD_GRADIENTS = [
  "bg-[linear-gradient(145deg,_#d3f1f4_0%,_#8edee1_100%)]",
  "bg-[linear-gradient(145deg,_#fff6ce_0%,_#f2d46f_100%)]",
  "bg-[linear-gradient(145deg,_#e8f5e1_0%,_#b9e68d_100%)]",
  "bg-[linear-gradient(145deg,_#fde8e4_0%,_#f7b9a6_100%)]",
  "bg-[linear-gradient(145deg,_#e8f5fb_0%,_#a9dce9_100%)]"
];
const MATERIAL_CARD_GRADIENTS = [
  "bg-[linear-gradient(145deg,_#fff1cf_0%,_#ffc98b_100%)]",
  "bg-[linear-gradient(145deg,_#d7f3d4_0%,_#83d7be_100%)]",
  "bg-[linear-gradient(145deg,_#fce2da_0%,_#f4c94c_100%)]"
];

const BOOK_TITLE_COLORS = ['text-[#12536b]', 'text-[#883743]', 'text-[#923b0b]', 'text-[#075c65]', 'text-[#285619]'];

const UPCOMING_BOOKS = [
  { number: 2, title: 'Recycling, Reuse & Where Litter Goes', note: 'Learning adventure • Title to be announced', description: 'Explore recycling and reuse, and discover what happens when litter reaches our roads, drains, and waterways.' },
  { number: 3, title: 'Mia & The Street Challenge', description: 'Follow Mia as she takes on a cleanup challenge and discovers how small actions add up.' },
  { number: 4, title: 'Neighborhood Challenge', note: 'Working title', description: 'Meet new Litter Heroes, celebrate new winners, and discover what it means to be a great sport.' },
  { number: 5, title: 'City Challenge', note: 'Working title', description: 'The adventure grows as Litter Heroes help make their city shine.' },
  { number: 6, title: 'State Challenge', note: 'Working title', description: 'Bring community pride to a bigger stage while cheering each other on.' },
];

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
              <span className="text-3xl font-extrabold text-[#0f9aa1] sm:text-4xl">Welcome to</span>
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
                <span className="text-[#0f9aa1]">!</span>
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg font-medium leading-relaxed text-[#002244]">
              Small actions can make a big difference. Meet Mia, Captain Can, the Mess Monster,
              and all our other Litter Heroes&mdash;and discover how one person and one piece can help make every place better.
            </p>
          </div>
        </section>


        <section aria-labelledby="street-challenge-invitation" className="border-y border-[#0f9aa1]/20 bg-[linear-gradient(180deg,_#f2fdff_0%,_#d7f3d4_52%,_#baeaf1_100%)] py-12 sm:py-16">
          <div className="container-custom text-center">
            <h2 id="street-challenge-invitation" className="text-3xl font-extrabold text-[#0f9aa1] sm:text-4xl">
              <span aria-hidden="true">🌟 </span>Ready to Be a Litter Hero?
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg font-medium leading-relaxed text-[#002244]">
              Play Street Challenge! Pick up litter, earn points, and compete for prizes while making your neighborhood shine.
            </p>
            <Link href="/street-challenge" className="btn-green mt-7 inline-flex min-h-12 items-center justify-center px-6 py-3 text-lg font-bold">
              Play Street Challenge!
            </Link>
          </div>
        </section>

        <section className="bg-[linear-gradient(180deg,_#fff6e4_0%,_#fff9ee_100%)] py-12 sm:py-16">
          <div className="container-custom px-6 sm:px-12 lg:px-20 xl:px-[5.5rem]">
            <div className="mx-auto max-w-5xl text-center">
              <h2 className="text-3xl font-extrabold text-[#0f9aa1] sm:text-4xl">Meet Our Litter Heroes!</h2>
              <p className="mx-auto mt-4 max-w-4xl text-center text-lg font-medium leading-relaxed text-[#002244] [text-wrap:balance]">Stories, learning tools, and real-world adventures for kids, families, and <span className="whitespace-nowrap">all Litter Heroes.</span></p>
              <p className="mt-2 text-lg font-medium leading-relaxed text-[#002244]">Read, explore, and cheer each other on!</p>
            </div>

            <div className="mx-auto mt-8 grid max-w-5xl grid-cols-1 items-center gap-8 rounded-2xl border border-[#0f9aa1]/15 p-6 md:grid-cols-[minmax(280px,360px)_1fr] md:gap-10 sm:p-8">
              <div className="mx-auto w-full max-w-[360px] overflow-hidden rounded-[1.5rem] shadow-[0_20px_45px_rgba(0,34,68,0.28)]">
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
              <div className="text-center md:text-left">
                <p className="mb-2 text-sm font-bold uppercase tracking-wide text-[#0f9aa1]">Book 1 • Read it now</p>
                <h3 className="text-3xl font-extrabold leading-tight text-[#0f9aa1] sm:text-4xl">Captain Can and the Messy Block</h3>
                <p className="mt-4 text-lg font-medium leading-relaxed text-[#002244]">
                  Join Mia and her super-powered sidekick, Captain Can, as they team up to take on
                  the mischievous Mess Monster and clean up their block&mdash;one piece of litter
                  at a time.
                </p>

                <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center md:justify-start">
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

        <section aria-labelledby="coming-soon-adventures" className="border-y border-[#0f9aa1]/20 bg-[linear-gradient(180deg,_#edf8e3_0%,_#d7efc5_100%)] py-12 sm:py-16">
          <div className="container-custom px-6 sm:px-12 lg:px-20 xl:px-[5.5rem]">
            <h2 id="coming-soon-adventures" className="text-center text-3xl font-extrabold text-[#0f9aa1] sm:text-4xl">More Adventures Coming Soon!</h2>
            <div className="mx-auto mt-6 grid max-w-5xl auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
              {UPCOMING_BOOKS.map((book, index) => (
                <article key={book.number} className={`h-full rounded-2xl border border-[#0f9aa1]/20 ${BOOK_CARD_GRADIENTS[index]} p-4 shadow-sm lg:col-span-2 ${index === 3 ? "lg:col-start-2" : ""}`}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-bold text-[#0f9aa1]">Book {book.number}</p>
                    <span className="rounded-full bg-[#fff1cf] px-3 py-1 text-sm font-bold text-[#002244]">Coming Soon!</span>
                  </div>
                  <h3 className={`mt-3 text-xl font-extrabold leading-tight ${BOOK_TITLE_COLORS[index]}`}>{book.title}</h3>
                  {book.note && <p className="mt-2 text-sm font-medium leading-relaxed text-[#002244]">{book.note}</p>}
                  <p className="mt-2 text-sm font-medium leading-relaxed text-[#002244]">{book.description}</p>
                </article>
              ))}
            </div>
            <p className="mx-auto mt-8 max-w-3xl text-center text-lg font-medium leading-relaxed text-[#002244]">
              More heroes are joining the adventures: Brave Beau, Bravo Belle, Outwit Oliver, Ocean Olivia, and Mess Master!
            </p>
          </div>
        </section>

        <section aria-labelledby="take-home-materials" className="border-t border-[#0f9aa1]/20 bg-[linear-gradient(180deg,_#ffd993_0%,_#fff1cf_100%)] py-12 sm:py-16">
          <div className="container-custom px-6 text-center sm:px-12 lg:px-20 xl:px-[5.5rem]">
            <h2 id="take-home-materials" className="text-3xl font-extrabold text-[#0f9aa1] sm:text-4xl">Take-Home Materials</h2>
            <div className="mx-auto mt-8 grid max-w-5xl gap-4 sm:grid-cols-3">
              {['Litter Hero Coloring Pages', 'Recycling & Reuse Guides', 'Learning & Cleanup Activities'].map((title, index) => (
                <div key={title} className={`rounded-2xl ${MATERIAL_CARD_GRADIENTS[index]} p-6`}>
                  <h3 className="text-3xl font-extrabold leading-tight text-[#0f9aa1] sm:text-4xl">{title}</h3>
                  <p className="mt-3 text-lg font-medium leading-relaxed text-[#002244]">Coming Soon!</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer alignWithPageContent />
    </>
  );
}
