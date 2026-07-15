import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Logo from '@/components/Logo';

export default function Home() {
  const quickLinks = [
    { label: 'Our Community', href: '/volunteer' },
    { label: 'Community Resources', href: '/community-resources' },
    { label: 'Shop Merch', href: '/shop' },
    { label: 'Donate', href: '/donate' },
    { label: 'Share Photos', href: '/contact' },
    { label: 'Join Us', href: '/volunteer' },
    { label: 'Contact Us', href: '/contact' },
  ];

  return (
    <>
      <Header />

      <main className="bg-[#fdf8eb] text-[#0f2b45]">
        <section className="relative overflow-visible border-b border-[#0f2b45]/10 bg-[linear-gradient(135deg,_#fffdf7_0%,_#f4fbff_35%,_#eefbf3_70%,_#fff3c4_100%)] py-20 sm:py-28">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(248,201,72,0.42),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(109,182,217,0.32),_transparent_30%),radial-gradient(circle_at_center_right,_rgba(98,178,117,0.28),_transparent_26%)]" />

          <div className="container-custom relative">
            <div className="mx-auto max-w-4xl text-center">
              <p className="inline-flex items-center rounded-full border border-[#0f2b45]/15 bg-[#0f2b45] px-4 py-2 text-sm font-semibold uppercase tracking-[0.25em] text-white shadow-[0_10px_24px_rgba(15,43,69,0.2)]">
                Seattle • Community • Care
              </p>
              <div className="mt-6 flex justify-center overflow-visible">
                <Logo href="/" showText className="w-[120vw] sm:w-[110rem] max-w-none justify-center" imgClassName="w-full" />
              </div>
              <p className="mt-4 text-2xl font-semibold text-[#1f5f7a] sm:text-3xl">
                One Person. One Piece. One Cleaner City.
              </p>
              <p className="mx-auto mt-5 max-w-3xl text-lg text-[#35506b] sm:text-xl">
                This is a community movement that makes it easy and fun to leave Seattle better than we found it.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <Link href="/volunteer" className="btn-primary">
                  Pick It Up With Us
                </Link>
                <Link href="/about" className="btn-outline border-[#0f2b45] bg-white/70 text-[#0f2b45] hover:bg-[#0f2b45] hover:text-white">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16 bg-[#fdf8eb]">
          <div className="container-custom">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {quickLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="rounded-[1.3rem] border border-[#0f2b45]/10 bg-[#f8f2e3] px-5 py-4 text-center text-lg font-semibold text-[#0f2b45] shadow-[0_12px_30px_rgba(15,43,69,0.08)] transition duration-200 hover:-translate-y-1 hover:bg-[#f2e6c7]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="day-one" className="bg-[#f7fbfd] py-16 sm:py-20">
          <div className="container-custom mx-auto">
            <div className="paint-card p-8 sm:p-10">
              <div className="mx-auto max-w-4xl text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#1f5f7a]">
                  Day One
                </p>
                <h2 className="mt-3 text-3xl font-bold text-[#0f2b45] sm:text-4xl">
                  One Person noticed. One piece got picked up. Look at the difference!!!
                </h2>

                <div className="mt-8 grid gap-6 lg:grid-cols-2">
                  <div className="rounded-[1.5rem] border border-dashed border-[#0f2b45]/20 bg-[#f9f6ea] p-6 text-left">
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#6b7280]">
                      Before
                    </p>
                    <div className="mt-4 flex h-48 items-center justify-center rounded-xl bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.95),_rgba(255,255,255,0.3))] text-6xl">
                      🌿
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] border border-dashed border-[#0f2b45]/20 bg-[#eef9f0] p-6 text-left">
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#6b7280]">
                      After
                    </p>
                    <div className="mt-4 flex h-48 items-center justify-center rounded-xl bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.95),_rgba(255,255,255,0.3))] text-6xl">
                      ✨
                    </div>
                  </div>
                </div>

                <p className="mt-8 text-xl font-semibold text-[#1f5f7a]">
                  We are just getting started!
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="bg-[#eef7fb] py-16 sm:py-20">
          <div className="container-custom mx-auto">
            <div className="mx-auto max-w-4xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#1f5f7a]">
                How It Works
              </p>
              <h2 className="mt-3 text-3xl font-bold text-[#0f2b45] sm:text-4xl">
                Three simple steps to keep Seattle cleaner.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
                Pick it up wherever you are, add the location, and share your before and after photos with the community.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <div className="paint-card p-7 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f8c948]/10 text-3xl text-[#f8c948]">
                  🖐️
                </div>
                <h3 className="mt-6 text-xl font-semibold text-[#0f2b45]">
                  Pick It Up
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Pick up one piece of litter.
                </p>
              </div>

              <div className="paint-card p-7 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#1f5f7a]/10 text-3xl text-[#1f5f7a]">
                  📍
                </div>
                <h3 className="mt-6 text-xl font-semibold text-[#0f2b45]">
                  Track It
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Add the location where you picked it up.
                </p>
              </div>

              <div className="paint-card p-7 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#6db6d9]/10 text-3xl text-[#6db6d9]">
                  📸
                </div>
                <h3 className="mt-6 text-xl font-semibold text-[#0f2b45]">
                  Share It
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Share your before and after photos.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#0f2b45] py-14 sm:py-16 text-white">
          <div className="container-custom text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Every small act helps shape a brighter Seattle.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-200">
              Join the movement, share kindness, and help our city shine.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/volunteer" className="btn-primary">
                Join Us
              </Link>
              <Link href="/contact" className="btn-outline">
                Contact Us
              </Link>
            </div>
          </div>
        </section>

        <section id="impact" className="bg-[#f7fbfd] pb-0 pt-12 sm:pt-16">
          <div className="container-custom mx-auto">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#1f5f7a]">
                Impact
              </p>
              <h2 className="mt-3 text-3xl font-bold text-[#0f2b45] sm:text-4xl">
                What we’ve done together so far.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
                Every count helps spread pride across our neighborhoods.
              </p>
            </div>

            <div className="mt-12 grid w-full grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="w-full rounded-[2rem] border border-[#0f2b45]/10 bg-white p-8 text-center shadow-[0_15px_35px_rgba(15,43,69,0.08)]">
                <p className="text-5xl font-black text-[#0f2b45]">0</p>
                <p className="mt-4 text-lg font-semibold text-[#1f5f7a]">Bags of Trash</p>
              </div>

              <div className="w-full rounded-[2rem] border border-[#0f2b45]/10 bg-white p-8 text-center shadow-[0_15px_35px_rgba(15,43,69,0.08)]">
                <p className="text-5xl font-black text-[#0f2b45]">0</p>
                <p className="mt-4 text-lg font-semibold text-[#1f5f7a]">Pounds of Litter</p>
              </div>

              <div className="w-full rounded-[2rem] border border-[#0f2b45]/10 bg-white p-8 text-center shadow-[0_15px_35px_rgba(15,43,69,0.08)]">
                <p className="text-5xl font-black text-[#0f2b45]">0</p>
                <p className="mt-4 text-lg font-semibold text-[#1f5f7a]">Neighborhoods</p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
