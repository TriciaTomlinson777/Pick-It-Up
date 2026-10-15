import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ShareButton from '@/components/ShareButton';
import Link from 'next/link';

const cardStyles = [
    {
      className: 'bg-[linear-gradient(145deg,_#0f9aa1_0%,_#2ec4c7_45%,_#69be28_100%)]',
      titleClassName: 'text-white [text-shadow:0_1px_2px_rgba(0,34,68,0.28)]',
      descriptionClassName: 'text-[#f7feff] [text-shadow:0_1px_2px_rgba(0,34,68,0.18)]',
    },
    {
      className: 'bg-[linear-gradient(145deg,_#0b7485_0%,_#0f9aa1_52%,_#2ec4c7_100%)]',
      titleClassName: 'text-white [text-shadow:0_1px_2px_rgba(0,34,68,0.28)]',
      descriptionClassName: 'text-[#f7feff] [text-shadow:0_1px_2px_rgba(0,34,68,0.18)]',
    },
    {
      className: 'bg-[linear-gradient(145deg,_#2ec4c7_0%,_#7cd157_62%,_#69be28_100%)]',
      titleClassName: 'text-[#002244] [text-shadow:0_1px_1px_rgba(255,255,255,0.14)]',
      descriptionClassName: 'text-[#062f21]',
    },
    {
      className: 'bg-[linear-gradient(145deg,_#002244_0%,_#1f5f7a_58%,_#2ec4c7_100%)]',
      titleClassName: 'text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.24)]',
      descriptionClassName: 'text-[#f0fcff] [text-shadow:0_1px_2px_rgba(0,0,0,0.14)]',
    },
    {
      className: 'bg-[linear-gradient(145deg,_#f4c94c_0%,_#f59a2d_55%,_#0f9aa1_100%)]',
      titleClassName: 'text-[#002244] [text-shadow:0_1px_1px_rgba(255,248,232,0.28)]',
      descriptionClassName: 'text-[#2f2400]',
    },
    {
      className: 'bg-[linear-gradient(145deg,_#69be28_0%,_#0f9aa1_50%,_#002244_100%)]',
      titleClassName: 'text-white [text-shadow:0_1px_2px_rgba(0,34,68,0.28)]',
      descriptionClassName: 'text-[#f7feff] [text-shadow:0_1px_2px_rgba(0,34,68,0.18)]',
    },
  ];

const kidsCornerColors = ['#0f9aa1', '#f59a2d', '#69be28', '#f4c94c', null, '#ef7f2d', '#2ec4c7', '#61b826', '#0fa5af', '#1fb8c2', '#d9665b'];

function KidsCornerName() {
  return (
    <span style={{ fontFamily: "var(--font-baloo-2), 'Trebuchet MS', 'Segoe UI', sans-serif", backgroundImage: "radial-gradient(ellipse at center, rgba(253,247,232,0.7) 0%, rgba(253,247,232,0.45) 45%, rgba(253,247,232,0) 75%)" }} className="box-decoration-clone font-extrabold">
      {'Kids Corner'.split('').map((letter, index) => (
        <span key={index} style={{ color: kidsCornerColors[index] }}>{letter === ' ' ? '\u00a0' : letter}</span>
      ))}
    </span>
  );
}

const actions = [
  { title: 'Every cleanup counts.', text: 'Pick up litter wherever you are, then add your cleanup to our community map. No photo required.', label: 'Log My Cleanup', href: '/#participate-track' },
  { title: 'Inspire Others', text: 'Share before-and-after photos and let others see what a little care can accomplish.', label: 'Share My Before & After', href: '/#participate-before-after' },
  { title: 'Celebrate Community!', text: 'Share a photo of people making a difference and help inspire someone else to join in.', label: 'Share a Community Photo', href: '/#participate-community-photo' },
  { title: 'A little thanks goes a long way.', text: 'Recognize someone whose kindness made a difference with a thank-you note.', label: 'Send a Thank You', href: '/#participate-thank-you' },
  { title: 'See something cool?', text: 'Discover something beautiful along the way? Share a photo of the places worth caring for.', label: 'Share a Scenic Discovery', href: '/#participate-scenic' },
  { title: 'Find your people.', text: 'Explore community cleanup events and follow the host’s details to take part.', label: 'Find an Event', href: '/events' },
];

const moreWays = [
  { title: 'Share Your Story', text: 'Tell us about a cleanup, a kind neighbor, or a moment that could encourage someone else.', href: '/blog#share-your-story' },
  { title: 'Donate', text: 'Support litter cleanup, children’s environmental education, and community participation.', href: '/donate' },
  { title: 'Become a Community Partner', text: 'Bring your school, business, or organization into the movement. Let’s explore what we can do together.', href: '/contact' },
];

export default function HowToParticipate() {
  return (
    <>
      <Header />
      <main className="text-[#002244]">
        <section className="bg-gradient-to-r from-seattle-green to-green-700 pb-4 pt-12 sm:pb-6 sm:pt-16">
          <div className="container-custom mx-auto max-w-4xl text-center">
            <h1 className="heading-xl mb-4 text-[#0f9aa1]"><span className="box-decoration-clone" style={{ backgroundImage: "radial-gradient(ellipse at center, rgba(253,247,232,0.7) 0%, rgba(253,247,232,0.45) 45%, rgba(253,247,232,0) 75%)" }}>How to Participate</span></h1>
            <p className="mt-5 text-2xl font-bold sm:text-3xl">Small actions. Many ways to make a difference.</p>
            <p className="mx-auto mt-4 max-w-2xl text-lg font-bold leading-8 text-[#002244]">Start with one piece of litter, one kind word, or one shared discovery. Choose a way to care for your community today.</p>
          </div>
        </section>

        <section aria-labelledby="take-action-title" className="pb-12 pt-4 sm:pb-16 sm:pt-6">
          <div className="container-custom">
            <h2 id="take-action-title" className="heading-lg mb-8 text-center text-[#0f9aa1]">What Will You Do Today?</h2>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {actions.map((action, index) => (
                <article key={action.href} className={`flex flex-col rounded-3xl border border-white/20 p-6 text-left shadow-sm sm:p-8 ${cardStyles[index].className}`}>
                  <h3 className={`text-[1.62rem] font-extrabold ${cardStyles[index].titleClassName}`}>{action.title}</h3>
                  <p className={`mb-6 mt-3 text-[1.44rem] font-medium leading-9 ${cardStyles[index].descriptionClassName}`}>{action.text}</p>
                  <Link href={action.href} className={`mt-auto inline-flex h-[4.5rem] w-60 max-w-full self-center items-center justify-center rounded-full px-3 py-1 text-center text-[1.3125rem] font-bold leading-[1.875rem] shadow-md transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${cardStyles[(index + 3) % cardStyles.length].className} ${cardStyles[(index + 3) % cardStyles.length].titleClassName}`}>{action.label}</Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="kids-purpose-title" className="px-4 py-12 sm:py-16">
          <div className={`mx-auto max-w-4xl rounded-3xl border border-white/20 p-6 text-center shadow-sm sm:p-8 ${cardStyles[0].className} ${cardStyles[0].descriptionClassName}`}>
            <h2 id="kids-purpose-title" className="inline-block px-4 py-3 text-[1.62rem] font-extrabold">
              <KidsCornerName />
            </h2>
            <h3 className="mt-4 text-[1.62rem] font-extrabold" style={{ color: kidsCornerColors[5] }}><span className="box-decoration-clone" style={{ backgroundImage: "radial-gradient(ellipse at center, rgba(253,247,232,0.7) 0%, rgba(253,247,232,0.45) 45%, rgba(253,247,232,0) 75%)" }}>Little actions. Lifelong habits.</span></h3>
            <p className="mt-6 text-left text-[1.44rem] font-medium leading-9">Children can make a difference right now. <KidsCornerName /> helps them discover the joy of contributing, taking responsibility, and showing kindness—all while having fun.</p>
            <p className="mt-4 text-left text-[1.44rem] font-medium leading-9">Through stories and simple activities, children can practice caring for their communities: picking up a piece of litter with a grown-up, thanking someone who helps, or leaving a place better than they found it.</p>
            <Link href="/kids-corner" className={`mt-7 inline-flex h-[4.5rem] w-60 max-w-full items-center justify-center rounded-full px-3 py-1 text-center text-[1.3125rem] font-bold leading-[1.875rem] shadow-md transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${cardStyles[3].className} ${cardStyles[3].titleClassName}`}><span>Explore <KidsCornerName /></span></Link>
          </div>
        </section>

        <section aria-labelledby="share-movement-title" className="py-12 sm:py-16">
          <div className="container-custom mx-auto max-w-4xl text-center">
            <h2 id="share-movement-title" className="heading-lg text-[#0f9aa1]">Share Pick It Up Together</h2>
            <p className="mx-auto mb-6 mt-4 max-w-2xl text-lg leading-8">Help educators, homeschooling families, and community organizations inspire children to care, contribute, and show kindness—one small action at a time.</p>
            <ShareButton url="/how-to-participate" title="Pick It Up Together" text="Small actions. Many ways to make a difference. Discover ways to help children and communities care, contribute, and show kindness." label="Share Pick It Up Together" className="min-h-12 justify-center px-7 py-3 text-base font-bold" />
          </div>
        </section>

        <section aria-labelledby="more-ways-title" className="bg-gray-50 py-12 sm:py-16">
          <div className="container-custom">
            <h2 id="more-ways-title" className="heading-lg mb-8 text-center text-[#0f9aa1]">More ways to help</h2>
            <div className="grid gap-5 md:grid-cols-3">
              {moreWays.map((way, index) => (
                <article key={way.href} className={`flex flex-col rounded-3xl border border-white/20 p-6 shadow-sm sm:p-8 ${cardStyles[index].className}`}>
                  <h3 className={`text-[1.62rem] font-extrabold ${cardStyles[index].titleClassName}`}>{way.title}</h3>
                  <p className={`mb-6 mt-3 text-[1.44rem] font-medium leading-9 ${cardStyles[index].descriptionClassName}`}>{way.text}</p>
                  <Link href={way.href} className={`mt-auto inline-flex h-[4.5rem] w-60 max-w-full self-center items-center justify-center rounded-full px-3 py-1 text-center text-[1.3125rem] font-bold leading-[1.875rem] shadow-md transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${cardStyles[index + 3].className} ${cardStyles[index + 3].titleClassName}`}>{way.title}</Link>
                </article>
              ))}
            </div>
            <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-6">For cleanups, wear gloves and closed-toe shoes, bring a bag and water, and choose a safe place. Children should take part with a grown-up. Leave sharp or hazardous items for trained crews.</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
