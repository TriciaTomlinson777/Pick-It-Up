"use client";

import { useState } from 'react';
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
      cardDescription: 'Browse our events calendar to find a cleanup event that works for you.',
      content: (
        <>
          <p className="text-gray-700 leading-relaxed">
            Browse our events calendar to find a cleanup event that works for you. Events are
            hosted throughout Seattle and surrounding cities. You&apos;ll find parks,
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
      cardDescription: 'Register for an event directly through our website and let us know how many people will be joining you.',
      content: (
        <>
          <p className="text-gray-700 leading-relaxed">
            Register for an event directly through our website and let us know how many people
            will be joining you.
            <br />
            <br />
            That&apos;s it-you&apos;re all set!
            <br />
            <br />
            Or organize your own Cleanup Adventure!
            <br />
            <br />
            Simply visit our website, select Events, and follow the prompts to create your own
            cleanup event. Maybe you&apos;re new to the area and want to meet new people,
            you&apos;re organizing a fun event for singles, your business wants to give back,
            or your community group is looking for a meaningful activity. Whatever theme you
            dream up, create your own adventure while making a positive impact on our
            community.
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
            Businesses, organizations, and community partners play an important role in helping
            us build a cleaner Seattle. There are many meaningful ways to support our
            volunteers and strengthen this community movement.
            <br />
            <br />
            Sponsor a cleanup event by providing volunteer T-shirts, litter grabbers, gloves,
            refreshments, or other supplies. Place a public trash can outside your business to
            help reduce litter, encourage your employees to participate in a Cleanup Adventure,
            or make a donation to help cover the operating costs of our completely
            volunteer-run organization.
            <br />
            <br />
            Have another creative idea? We&apos;d love to hear it! We believe the best ideas
            often come from our community, and we&apos;re always excited to explore new
            partnerships that inspire others and make an even greater impact.
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
              <h3 className="mb-6 text-xl font-bold text-[#f4c94c]">Spread the Message</h3>
              <ul className="space-y-3">
                {[
                  'Volunteer Apparel',
                  'Hats & Accessories',
                  'Cleanup Gear',
                  'Reusable Bags',
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
                Absolutely! We encourage families, friends, and groups to join us. It's a great
                way to make a difference together. Just let us know how many people will be
                attending when you sign up.
              </p>
            </details>

            <details className="cursor-pointer rounded-lg bg-[#f4c94c] p-4 transition hover:bg-[#e7ba36]">
              <summary className="text-base font-bold text-[#002244]">
                What if it rains?
              </summary>
              <p className="mt-3 text-sm leading-6 text-[#3b2c00]">
                We clean up rain or shine unless there is severe weather or unsafe conditions. If
                rain is expected, simply dress for the weather. We'll keep you informed of any
                schedule changes.
              </p>
            </details>

            <details className="cursor-pointer rounded-lg bg-[#ef7f2d] p-4 transition hover:bg-[#df6f1e]">
              <summary className="text-base font-bold text-white">
                Can I organize a private group event?
              </summary>
              <p className="mt-3 text-sm leading-6 text-[#fff6ec]">
                Yes! We'd love to help you organize a cleanup for your business, school,
                neighborhood, or community group. Visit our Partners page or Contact Us to get
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
            Join us at an upcoming event and be part of the movement to make Seattle cleaner and
            more beautiful!
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
