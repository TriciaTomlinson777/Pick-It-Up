import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ShareButton from '@/components/ShareButton';
import Link from 'next/link';

const cardStyles = [
    {
      className: 'bg-[linear-gradient(145deg,_#0f9aa1_0%,_#2ec4c7_45%,_#69be28_100%)]',
      titleClassName: 'text-white [text-shadow:0_1px_2px_rgba(0,34,68,0.28)]',
      descriptionClassName: 'text-[#f7feff] [text-shadow:0_1px_2px_rgba(0,34,68,0.18)]',
      iconClassName: 'text-white drop-shadow-[0_2px_3px_rgba(0,34,68,0.28)]',
    },
    {
      className: 'bg-[linear-gradient(145deg,_#0b7485_0%,_#0f9aa1_52%,_#2ec4c7_100%)]',
      titleClassName: 'text-white [text-shadow:0_1px_2px_rgba(0,34,68,0.28)]',
      descriptionClassName: 'text-[#f7feff] [text-shadow:0_1px_2px_rgba(0,34,68,0.18)]',
      iconClassName: 'text-white drop-shadow-[0_2px_3px_rgba(0,34,68,0.28)]',
    },
    {
      className: 'bg-[linear-gradient(145deg,_#2ec4c7_0%,_#7cd157_62%,_#69be28_100%)]',
      titleClassName: 'text-[#002244] [text-shadow:0_1px_1px_rgba(255,255,255,0.14)]',
      descriptionClassName: 'text-[#062f21]',
      iconClassName: 'text-[#002244] drop-shadow-[0_1px_1px_rgba(255,255,255,0.18)]',
    },
    {
      className: 'bg-[linear-gradient(145deg,_#002244_0%,_#1f5f7a_58%,_#2ec4c7_100%)]',
      titleClassName: 'text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.24)]',
      descriptionClassName: 'text-[#f0fcff] [text-shadow:0_1px_2px_rgba(0,0,0,0.14)]',
      iconClassName: 'text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.24)]',
    },
    {
      className: 'bg-[linear-gradient(145deg,_#f4c94c_0%,_#f59a2d_55%,_#0f9aa1_100%)]',
      titleClassName: 'text-[#002244] [text-shadow:0_1px_1px_rgba(255,248,232,0.28)]',
      descriptionClassName: 'text-[#2f2400]',
      iconClassName: 'text-[#002244] drop-shadow-[0_1px_1px_rgba(255,248,232,0.22)]',
    },
    {
      className: 'bg-[linear-gradient(145deg,_#69be28_0%,_#0f9aa1_50%,_#002244_100%)]',
      titleClassName: 'text-white [text-shadow:0_1px_2px_rgba(0,34,68,0.28)]',
      descriptionClassName: 'text-[#f7feff] [text-shadow:0_1px_2px_rgba(0,34,68,0.18)]',
      iconClassName: 'text-white drop-shadow-[0_2px_3px_rgba(0,34,68,0.28)]',
    },
  ];

const kidsCornerColors = ['#0f9aa1', '#f59a2d', '#69be28', '#f4c94c', null, '#ef7f2d', '#2ec4c7', '#61b826', '#0fa5af', '#1fb8c2', '#d9665b'];

const actions = [
  { icon: '📍', title: 'Every cleanup counts.', text: 'Pick up litter wherever you are, then add your cleanup to our community map. No photo required.', label: 'Log My Cleanup', href: '/#participate-track' },
  { icon: '📸', title: 'Show the difference.', text: 'Share before-and-after photos and let others see what a little care can accomplish.', label: 'Share My Before & After', href: '/#participate-before-after' },
  { icon: '💚', title: 'Celebrate community care.', text: 'Share a photo of people making a difference and help inspire someone else to join in.', label: 'Share a Community Photo', href: '/#participate-community-photo' },
  { icon: '💌', title: 'A little thanks goes a long way.', text: 'Recognize someone whose kindness made a difference with a thank-you note.', label: 'Send a Thank You', href: '/#participate-thank-you' },
  { icon: '🌻', title: 'Notice the beauty.', text: 'Discover something beautiful along the way? Share a photo of the places worth caring for.', label: 'Share a Scenic Discovery', href: '/#participate-scenic' },
  { icon: '🧤', title: 'Find your people.', text: 'Explore community cleanup events and follow the host’s details to take part.', label: 'Find an Event', href: '/events' },
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
      <main className="bg-[#fdf7e8] text-[#002244]">
        <section className="bg-[#fdf7e8] py-12 sm:py-16">
          <div className="container-custom mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-extrabold text-[#0f9aa1] sm:text-5xl">How to Participate</h1>
            <p className="mt-5 text-2xl font-bold sm:text-3xl">Small actions. Many ways to make a difference.</p>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8">Start with one piece of litter, one kind word, or one shared discovery. Choose a way to care for your community today.</p>
          </div>
        </section>

        <section aria-labelledby="take-action-title" className="py-12 sm:py-16">
          <div className="container-custom">
            <h2 id="take-action-title" className="mb-8 text-center text-3xl font-bold text-[#0f9aa1]">What will you do today?</h2>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {actions.map((action, index) => (
                <article key={action.href} className={`flex flex-col rounded-3xl border border-[#0f9aa1]/15 p-6 shadow-sm sm:p-8 ${cardStyles[index].className}`}>
                  <span aria-hidden="true" className={`text-3xl ${cardStyles[index].iconClassName}`}>{action.icon}</span>
                  <h3 className={`mt-4 text-2xl font-bold ${cardStyles[index].titleClassName}`}>{action.title}</h3>
                  <p className={`mb-6 mt-3 leading-7 ${cardStyles[index].descriptionClassName}`}>{action.text}</p>
                  <Link href={action.href} className="mt-auto inline-flex min-h-12 justify-center rounded-full border border-white/70 bg-white px-5 py-3 text-center font-bold text-[#002244] shadow-sm transition hover:bg-[#fff4cc]">{action.label}</Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="kids-purpose-title" className="hero-surface border-y border-[#0f9aa1]/20 py-12 sm:py-16">
          <div className="container-custom mx-auto max-w-4xl text-center">
            <h2 id="kids-purpose-title" className="text-5xl font-extrabold sm:text-6xl lg:text-7xl">
              {'Kids Corner'.split('').map((letter, index) => letter === ' ' ? (
                <span key={index}>&nbsp;</span>
              ) : (
                <span key={index} style={{ color: kidsCornerColors[index] }}>{letter}</span>
              ))}
            </h2>
            <h3 className="mt-4 text-3xl font-extrabold sm:text-4xl">Little actions. Lifelong habits.</h3>
            <p className="mt-6 text-lg leading-8">Children can make a difference right now. Kids Corner helps them discover the joy of contributing, taking responsibility, and showing kindness—all while having fun.</p>
            <p className="mt-4 text-lg leading-8">Through stories and simple activities, children can practice caring for their communities: picking up a piece of litter with a grown-up, thanking someone who helps, or leaving a place better than they found it.</p>
            <Link href="/kids-corner" className="btn-green mt-7 inline-flex min-h-12 justify-center rounded-full px-7 py-3 font-bold">Explore Kids Corner</Link>
          </div>
        </section>

        <section aria-labelledby="share-movement-title" className="py-12 sm:py-16">
          <div className="container-custom mx-auto max-w-4xl text-center">
            <h2 id="share-movement-title" className="text-3xl font-bold text-[#0f9aa1]">Share Pick It Up Together</h2>
            <p className="mx-auto mb-6 mt-4 max-w-2xl text-lg leading-8">Help educators, homeschooling families, and community organizations inspire children to care, contribute, and show kindness—one small action at a time.</p>
            <ShareButton url="/how-to-participate" title="Pick It Up Together" text="Small actions. Many ways to make a difference. Discover ways to help children and communities care, contribute, and show kindness." label="Share Pick It Up Together" className="min-h-12 justify-center px-7 py-3 text-base font-bold" />
          </div>
        </section>

        <section aria-labelledby="more-ways-title" className="bg-gray-50 py-12 sm:py-16">
          <div className="container-custom">
            <h2 id="more-ways-title" className="mb-8 text-center text-3xl font-bold text-[#0f9aa1]">More ways to help</h2>
            <div className="grid gap-5 md:grid-cols-3">
              {moreWays.map((way) => (
                <article key={way.href} className="flex flex-col rounded-3xl bg-white p-6 sm:p-8">
                  <h3 className="text-xl font-bold">{way.title}</h3>
                  <p className="mb-6 mt-3 leading-7">{way.text}</p>
                  <Link href={way.href} className="mt-auto inline-flex min-h-12 items-center justify-center rounded-full border-2 border-[#0b7485] px-5 py-3 text-center font-bold text-[#0f9aa1] hover:bg-[#e5f7f5]">{way.title}</Link>
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
