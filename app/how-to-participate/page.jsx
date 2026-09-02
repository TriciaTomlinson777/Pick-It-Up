"use client";

import { useState } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function HowToParticipate() {
  const [activeStepId, setActiveStepId] = useState('');

  const participationStepCardStyles = [
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

  const participationSteps = [
    {
      id: 'step-1',
      buttonLabel: 'Step 1. Find an Event',
      title: 'Step 1: Find an Event',
      icon: '📍',
      cardDescription: 'Browse the Events page to find a community cleanup that works for you.',
      content: (
        <>
          <p className="text-gray-700 leading-relaxed">
            Browse the Events page to find a community cleanup that works for you. You&apos;ll find
            community cleanups throughout Seattle and surrounding cities, including parks,
            neighborhoods, beaches, and specific areas where others are coming together to make
            a difference.
            <br />
            <br />
            You&apos;ll also find themed cleanup gatherings, whether it&apos;s for a business
            you&apos;re involved with or a community group looking for a fun activity or a
            great way to meet other kind people who care about their communities.
            <br />
            <br />
            Whether you can give one hour or four hours, there are opportunities for everyone.
          </p>
          <Link href="/events" className="inline-block mt-4 text-seattle-green font-semibold hover:underline">
            View Events →
          </Link>
        </>
      ),
    },
    {
      id: 'step-2',
      buttonLabel: 'Step 2. Sign Up',
      title: 'Step 2: Sign Up',
      icon: '📝',
      cardDescription: 'Follow the host organization\'s registration details and share your group size when requested.',
      content: (
        <>
          <p className="text-gray-700 leading-relaxed">
            Follow the host organization&apos;s registration details and share your group size when
            requested.
            <br />
            <br />
            That&apos;s it-you&apos;re all set!
            <br />
            <br />
            Or plan your own Cleanup Adventure!
            <br />
            <br />
            Use the Events page to find community organizations and resources that can help you
            plan a cleanup. Maybe you&apos;re new to the area and want to meet new people,
            your business wants to give back, or your community group is looking for a meaningful
            activity. After your cleanup, share the impact with Pick It Up Seattle — post a
            Before/After, thank someone who helped, share a Scenic Discovery, or log your cleanup.
          </p>
          <Link href="/volunteer" className="inline-block mt-4 text-seattle-green font-semibold hover:underline">
            Volunteer Now →
          </Link>
        </>
      ),
    },
    {
      id: 'step-3',
      buttonLabel: 'Step 3. Show Up',
      title: 'Step 3: Show Up',
      icon: '🧤',
      cardDescription: 'Arrive a few minutes early, bring a positive attitude, and get ready to make a difference.',
      content: (
        <p className="text-gray-700 leading-relaxed">
          Arrive a few minutes early, bring a positive attitude, wear comfortable clothes,
          and get ready to make a difference! If you have work gloves or a litter grabber,
          feel free to bring them-they&apos;re always helpful.
          <br />
          <br />
          Want to inspire others? Pick up a Pick It Up Seattle volunteer T-shirt, hat, or
          other gear to proudly show you&apos;re part of the movement. Every purchase helps
          spread the word and supports the costs of operating our completely volunteer-run
          organization.
        </p>
      ),
    },
    {
      id: 'step-4',
      buttonLabel: 'Step 4. Celebrate!',
      title: 'Step 4: Celebrate!',
      icon: '🎉',
      cardDescription: 'Take a moment to connect, celebrate what you accomplished, and enjoy the impact you made.',
      content: (
        <p className="text-gray-700 leading-relaxed">
          After the cleanup, take a moment to connect with your fellow volunteers. Many
          groups gather afterward to share stories, celebrate what they&apos;ve accomplished,
          and enjoy the satisfaction of leaving their community cleaner than they found it.
          <br />
          <br />
          Every piece of litter picked up matters. Every volunteer makes a difference.
          Together, we&apos;re building a cleaner, more beautiful Seattle-one piece at a time.
        </p>
      ),
    },
    {
      id: 'step-5',
      buttonLabel: 'Step 5. Create Your Own Impact',
      title: 'Step 5: Create Your Own Impact',
      icon: '✨',
      cardDescription: 'Head out on your own schedule and make a difference in your neighborhood or favorite local place.',
      content: (
        <p className="text-gray-700 leading-relaxed">
          You don&apos;t have to wait for a scheduled event to make a difference. Head out
          whenever it fits your schedule and clean up your own neighborhood, favorite park,
          beach, trail, or anywhere you notice litter. Invite a neighbor, a friend, your
          family, coworkers, or simply enjoy the satisfaction of making a difference on your
          own.
          <br />
          <br />
          When you&apos;re finished, don&apos;t forget to record your cleanup using the
          Track It feature and share your photos. Every cleanup you log inspires others,
          helps show our growing community impact, and encourages more people to join the
          movement.
          <br />
          <br />
          Remember, every piece picked up makes Seattle a little cleaner-and together those
          small actions create extraordinary change.
        </p>
      ),
    },
    {
      id: 'step-6',
      buttonLabel: 'Step 6. Businesses & Community Partners',
      title: 'Step 6: Businesses & Community Partners',
      icon: '🤝',
      cardDescription: 'Support volunteers and strengthen the movement through partnerships, sponsorships, and creative ideas.',
      content: (
        <>
          <p className="text-gray-700 leading-relaxed">
            Businesses, organizations, and community partners can play an important role in
            helping build a cleaner Seattle.
            <br />
            <br />
            Imagine… if every person left every place better than they found it.
            <br />
            <br />
            Pick It Up Seattle is built on the idea that small actions matter. One person
            picking up one piece of litter may seem small, but when a community joins in,
            those small acts can help create a cleaner, brighter, more connected city.
            <br />
            <br />
            We encourage people to notice the beauty around them, take pride in their
            neighborhoods, and help inspire others through simple everyday action. Through
            photos, shared stories, community participation, and positive recognition, Pick It
            Up Seattle is designed to make caring for our city feel visible, rewarding, and
            contagious.
          </p>

          <div className="mt-8 grid grid-cols-1 items-center gap-6 rounded-2xl bg-[#f2fbff] p-5 sm:p-6 md:grid-cols-2 md:gap-8">
            <div>
              <h4 className="text-lg font-bold text-[#0f9aa1]">Sponsor a Can</h4>
              <p className="mt-3 text-gray-700 leading-relaxed">
                One of our most exciting next steps is our Sponsor a Can initiative.
                <br />
                <br />
                The idea is simple: place attractive public-facing litter cans where they can
                make a real difference, and invite businesses and community partners to help
                support a cleaner block, street, or neighborhood.
                <br />
                <br />
                We are developing this as a pilot program, with the goal of using grant funding
                to help with the initial cost of the can while participating businesses or
                property owners help support ongoing service. We are currently looking for our
                first 10 Founding Sponsor a Can partners.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="relative h-56 w-full max-w-[220px] overflow-hidden rounded-xl bg-white p-3 shadow-md sm:h-64">
                <Image
                  src="/PIUS Litter Can.png"
                  alt="Pick It Up Seattle Sponsor a Can litter can"
                  fill
                  className="object-contain"
                />
              </div>
              <p className="mt-3 text-sm font-semibold text-[#1f5f7a]">Help create a cleaner block.</p>
            </div>
          </div>

          <p className="mt-6 text-gray-700 leading-relaxed">
            This is a practical, visible, and community-minded way for local businesses and
            supporters to help make Seattle cleaner — not just for themselves, but for everyone
            who lives, works, and walks in our city.
            <br />
            <br />
            In addition to Sponsor a Can, partners may also support Pick It Up Seattle through
            volunteer T-shirts, outreach support, community encouragement, donated materials, or
            other creative ideas that help grow the movement.
            <br />
            <br />
            Have another idea? We&apos;d love to hear it. Some of the best community
            partnerships begin with one thoughtful conversation.
          </p>
          <Link href="/contact" className="inline-block mt-4 text-seattle-green font-semibold hover:underline">
            Become a Community Partner →
          </Link>
        </>
      ),
    },
  ];

  const activeStep = participationSteps.find((step) => step.id === activeStepId) || null;

  return (
    <>
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-r from-seattle-green to-green-700 text-white py-16">
        <div className="container-custom">
          <h1 className="heading-xl mb-4 text-[#0f9aa1]">How to Participate</h1>
          <p className="text-xl font-semibold text-[#002244] sm:text-[1.35rem]">
            Everything you need to know to make a difference with Pick It Up
          </p>
        </div>
      </section>

      {/* Getting Started */}
      <section className="py-16 sm:py-24">
        <div className="container-custom">
          <h2 className="heading-lg mb-12 text-[#0f9aa1]">Getting Started</h2>
          <div className="rounded-2xl bg-white p-6 shadow-md sm:p-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {participationSteps.map((step, index) => {
                const cardStyle = participationStepCardStyles[index] || participationStepCardStyles[0];

                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setActiveStepId(step.id)}
                    className={`flex min-h-[96px] w-full items-center gap-3 rounded-xl border border-white/20 px-5 py-4 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(0,43,73,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f9aa1] ${cardStyle.className}`}
                  >
                    <span className={`text-[1.9rem] ${cardStyle.iconClassName}`} aria-hidden="true">{step.icon}</span>
                    <span>
                      <span className={`block text-[1.08rem] font-extrabold ${cardStyle.titleClassName}`}>{step.buttonLabel}</span>
                      <span className={`mt-1 block text-[0.96rem] font-medium leading-6 ${cardStyle.descriptionClassName}`}>{step.cardDescription}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {activeStep ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#002244]/70 p-4" role="dialog" aria-modal="true" aria-labelledby="participation-step-modal-title">
          <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl sm:p-8">
            <button
              type="button"
              onClick={() => setActiveStepId('')}
              className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#0f9aa1]/30 text-2xl leading-none text-[#1f5f7a] transition hover:bg-[#f2fbff]"
              aria-label="Close participation step"
            >
              ×
            </button>

            <h3 id="participation-step-modal-title" className="text-2xl font-bold text-seattle-green sm:text-3xl">
              {activeStep.title}
            </h3>

            <div className="mt-6 text-base leading-7">
              {activeStep.content}
            </div>
          </div>
        </div>
      ) : null}

      {/* What to Bring */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="container-custom">
          <h2 className="heading-lg mb-12 text-[#0f9aa1]">What to Bring</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="mb-6 text-xl font-bold text-[#ef7f2d]">Essentials</h3>
              <ul className="space-y-3">
                {[
                  'Comfortable, closed-toe shoes',
                  'Weather-appropriate clothing',
                  'Sunscreen and hat',
                  'Reusable water bottle',
                  'Phone for emergencies',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="mr-3 text-lg font-bold text-[#0f9aa1]">✓</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-6 text-xl font-bold text-[#f4c94c]">Represent the Movement</h3>
              <ul className="space-y-3">
                {[
                  'Volunteer T-shirt',
                  'Hat or other PIUS apparel',
                  'Reusable Bags',
                  'Share PickItUpSeattle.org',
                  'Available in our Shop',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="mr-3 text-lg font-bold text-[#0f9aa1]">✓</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-24">
        <div className="container-custom">
          <h2 className="heading-lg mb-12 text-[#0f9aa1]">Frequently Asked Questions</h2>
          <div className="max-w-3xl space-y-3">
            <details className="cursor-pointer rounded-lg bg-[#1fb8c2] p-4 transition hover:bg-[#0fa5af]">
              <summary className="text-base font-bold text-white">
                Can I bring my family or friends?
              </summary>
              <p className="mt-3 text-sm leading-6 text-[#f2fdff]">
                Absolutely! Families, friends, and groups can join community cleanups together.
                Check the host organization&apos;s signup details for group size and participation
                information.
              </p>
            </details>

            <details className="cursor-pointer rounded-lg bg-[#f4c94c] p-4 transition hover:bg-[#e7ba36]">
              <summary className="text-base font-bold text-[#002244]">
                What if it rains?
              </summary>
              <p className="mt-3 text-sm leading-6 text-[#3b2c00]">
                Cleanup hosts set their own weather and safety plans. Check the event details
                before heading out, and dress for the conditions.
              </p>
            </details>

            <details className="cursor-pointer rounded-lg bg-[#ef7f2d] p-4 transition hover:bg-[#df6f1e]">
              <summary className="text-base font-bold text-white">
                Can I organize a private group event?
              </summary>
              <p className="mt-3 text-sm leading-6 text-[#fff6ec]">
                Yes! The Events page and partner resources can help your business, neighborhood,
                or community group plan a cleanup. Visit our Partners page or Contact Us to get
                started.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#fff4cc] py-16 sm:py-24">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-bold mb-6 text-[#002244]">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-[#1f2937]">
            Pick up one piece (or more) wherever you are, or join a Cleanup Adventure hosted by a
            community partner.
          </p>
          <Link href="/events" className="btn-primary bg-seattle-green text-white hover:bg-green-700 transform-none hover:translate-y-0">
            Find an Event
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
