"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SITE_CONTACT_EMAIL, SITE_CONTACT_MAILTO } from '@/lib/site-contact';

export default function Volunteer() {
  const participationCardBackgroundClasses = [
    'bg-[linear-gradient(145deg,_#0f9aa1_0%,_#2ec4c7_45%,_#69be28_100%)]',
    'bg-[linear-gradient(145deg,_#0b7485_0%,_#0f9aa1_52%,_#2ec4c7_100%)]',
    'bg-[linear-gradient(145deg,_#2ec4c7_0%,_#7cd157_62%,_#69be28_100%)]',
    'bg-[linear-gradient(145deg,_#002244_0%,_#1f5f7a_58%,_#2ec4c7_100%)]',
    'bg-[linear-gradient(145deg,_#f4c94c_0%,_#f59a2d_55%,_#0f9aa1_100%)]',
    'bg-[linear-gradient(145deg,_#69be28_0%,_#0f9aa1_50%,_#002244_100%)]',
    'bg-[linear-gradient(145deg,_#1f5f7a_0%,_#0f9aa1_55%,_#f4c94c_100%)]',
    'bg-[linear-gradient(145deg,_#002244_0%,_#0f9aa1_48%,_#69be28_82%,_#f4c94c_100%)]',
  ];

  const participationCardContentStyles = [
    {
      titleClassName: 'text-white',
      descriptionClassName: 'text-[#f2fdff]',
      iconClassName: 'text-white',
    },
    {
      titleClassName: 'text-white',
      descriptionClassName: 'text-[#f2fdff]',
      iconClassName: 'text-white',
    },
    {
      titleClassName: 'text-[#002244]',
      descriptionClassName: 'text-[#0a3b25]',
      iconClassName: 'text-[#002244]',
    },
    {
      titleClassName: 'text-white',
      descriptionClassName: 'text-[#e8fbff]',
      iconClassName: 'text-white',
    },
    {
      titleClassName: 'text-[#002244]',
      descriptionClassName: 'text-[#3b2c00]',
      iconClassName: 'text-[#002244]',
    },
    {
      titleClassName: 'text-white',
      descriptionClassName: 'text-[#f2fdff]',
      iconClassName: 'text-white',
    },
    {
      titleClassName: 'text-white',
      descriptionClassName: 'text-[#fef7df]',
      iconClassName: 'text-white',
    },
    {
      titleClassName: 'text-white',
      descriptionClassName: 'text-[#fff8e8]',
      iconClassName: 'text-white',
    },
  ];

  const siteUrl = 'https://www.pickitupseattle.org/';
  const [activePanel, setActivePanel] = useState('');
  const [copyMessage, setCopyMessage] = useState('');
  const [showPhotographerForm, setShowPhotographerForm] = useState(false);
  const [showAmbassadorForm, setShowAmbassadorForm] = useState(false);

  const closeModal = () => {
    setActivePanel('');
    setCopyMessage('');
    setShowPhotographerForm(false);
    setShowAmbassadorForm(false);
  };

  useEffect(() => {
    if (!activePanel) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [activePanel]);

  const participationOptions = [
    {
      icon: '🧤',
      title: 'Join Cleanup Adventures',
      description: 'Show up, pick up, and help make Seattle cleaner one piece at a time.',
      type: 'link',
      href: '/events?view=join#join-cleanup',
    },
    {
      icon: '📣',
      title: 'Spread the Word',
      description: 'Share the message with friends, neighbors, coworkers, and your community.',
      type: 'panel',
      panelKey: 'spread-word',
    },
    {
      icon: '📱',
      title: 'Community Ambassador',
      description: 'Use your influence, platform, and community to help more people discover and join the movement.',
      type: 'panel',
      panelKey: 'social-ambassador',
    },
    {
      icon: '📸',
      title: 'Photography & Stories',
      description: 'Capture the moments that show what a little community care can do.',
      type: 'panel',
      panelKey: 'photography-stories',
    },
    {
      icon: '🤝',
      title: 'Community Partner',
      description: 'Bring your business, organization, or group into the movement.',
      type: 'panel',
      panelKey: 'community-partner',
    },
    {
      icon: '🎉',
      title: 'Organize a Cleanup',
      description: 'Lead a cleanup that brings people together and leaves a visible impact.',
      type: 'link',
      href: '/events?view=organize#organize-cleanup',
    },
    {
      icon: '🎨',
      title: 'Creative Team',
      description: 'Use design, writing, or creative ideas to help share the mission beautifully.',
      type: 'panel',
      panelKey: 'creative-team',
    },
    {
      icon: '💚',
      title: 'Support the Mission',
      description: 'Contribute supplies, support, and encouragement that keep the momentum growing.',
      type: 'panel',
      panelKey: 'support-mission',
    },
  ];

  const cardClassName = 'flex h-full flex-col rounded-2xl border border-[#0f9aa1]/18 p-6 shadow-[0_14px_30px_rgba(0,43,73,0.1)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(0,43,73,0.14)]';

  const handleShareFacebook = () => {
    const encodedUrl = encodeURIComponent(siteUrl);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank', 'noopener,noreferrer');
  };

  const handleShareNextdoor = () => {
    window.open('https://nextdoor.com/', '_blank', 'noopener,noreferrer');
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent('Join me in supporting Pick It Up Seattle');
    const body = encodeURIComponent(`I thought you would love this movement: ${siteUrl}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleCopyWebsiteLink = async () => {
    try {
      await navigator.clipboard.writeText(siteUrl);
      setCopyMessage('Website link copied.');
    } catch {
      setCopyMessage('Copy is unavailable in this browser.');
    }
  };

  const renderCard = (option, index) => {
    const backgroundClassName = participationCardBackgroundClasses[index] || participationCardBackgroundClasses[0];
    const contentStyle = participationCardContentStyles[index] || participationCardContentStyles[0];

    if (option.type === 'link') {
      return (
        <Link key={option.title} href={option.href} className={`${cardClassName} ${backgroundClassName}`}>
          <div className={`text-4xl ${contentStyle.iconClassName}`} aria-hidden="true">
            {option.icon}
          </div>
          <h3 className={`mt-4 text-2xl font-bold ${contentStyle.titleClassName}`}>{option.title}</h3>
          <p className={`mt-3 text-base leading-7 ${contentStyle.descriptionClassName}`}>{option.description}</p>
        </Link>
      );
    }

    return (
      <button
        key={option.title}
        type="button"
        onClick={() => {
          setActivePanel(option.panelKey);
          setCopyMessage('');
          setShowAmbassadorForm(false);
          if (option.panelKey !== 'photography-stories') {
            setShowPhotographerForm(false);
          }
        }}
        className={`${cardClassName} ${backgroundClassName} text-left`}
      >
        <div className={`text-4xl ${contentStyle.iconClassName}`} aria-hidden="true">
          {option.icon}
        </div>
        <h3 className={`mt-4 text-2xl font-bold ${contentStyle.titleClassName}`}>{option.title}</h3>
        <p className={`mt-3 text-base leading-7 ${contentStyle.descriptionClassName}`}>{option.description}</p>
      </button>
    );
  };

  const renderActivePanel = () => {
    if (!activePanel) {
      return null;
    }

    if (activePanel === 'spread-word') {
      return (
        <div className="rounded-2xl border border-[#0f9aa1]/18 bg-white p-6 shadow-[0_14px_30px_rgba(0,43,73,0.1)] sm:p-8">
          <h3 className="text-2xl font-bold text-[#002b49]">Help Us Spread the Word!</h3>
          <p className="mt-3 text-base leading-7 text-[#516b7d]">Every share helps more people discover Pick It Up Seattle.</p>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button type="button" onClick={handleShareFacebook} className="btn-primary w-full">Share on Facebook</button>
            <button type="button" onClick={handleShareNextdoor} className="btn-secondary w-full">Share on Nextdoor</button>
            <button type="button" onClick={handleShareEmail} className="btn-aqua w-full">Share by Email</button>
            <button type="button" onClick={handleCopyWebsiteLink} className="btn-warm w-full">Copy Website Link</button>
          </div>
          {copyMessage ? (
            <p className="mt-4 text-sm text-[#1f5f7a]">{copyMessage}</p>
          ) : null}
        </div>
      );
    }

    if (activePanel === 'social-ambassador') {
      return (
        <div className="rounded-2xl border border-[#0f9aa1]/18 bg-white p-6 shadow-[0_14px_30px_rgba(0,43,73,0.1)] sm:p-8">
          <h3 className="text-2xl font-bold text-[#002b49]">Community Ambassador</h3>
          <p className="mt-2 text-lg font-semibold text-[#1f5f7a]">Help Inspire a Cleaner Seattle</p>
          <p className="mt-4 text-base leading-7 text-[#516b7d]">Powerful movements grow because people choose to share them.</p>
          <p className="mt-3 text-base leading-7 text-[#516b7d]">If you already inspire others through social media, podcasts, newsletters, videos, photography, writing, public speaking, community leadership, or other creative platforms, we’d love your help introducing more people to Pick It Up Seattle.</p>
          <p className="mt-3 text-base leading-7 text-[#516b7d]">Your voice, your creativity, and your community can help inspire thousands of people to make one small difference.</p>

          <h4 className="mt-6 text-xl font-bold text-[#002b49]">Ways You Can Help</h4>
          <ul className="mt-3 space-y-2 text-base leading-7 text-[#516b7d]">
            <li>Share the Pick It Up Seattle movement with your audience.</li>
            <li>Highlight local cleanup adventures.</li>
            <li>Celebrate volunteers making a difference.</li>
            <li>Feature community success stories.</li>
            <li>Encourage others to organize neighborhood cleanups.</li>
            <li>Inspire positive action through your own unique style and platform.</li>
          </ul>

          <h4 className="mt-6 text-xl font-bold text-[#002b49]">Connect With Us</h4>
          <p className="mt-2 text-base leading-7 text-[#516b7d]">Follow Pick It Up Seattle on:</p>
          <div className="mt-3 flex flex-wrap gap-3">
            <a href="#" className="btn-secondary">Instagram</a>
            <a href="#" className="btn-aqua">TikTok</a>
            <a href="#" className="btn-green">Facebook</a>
            <a href="#" className="btn-warm">YouTube</a>
            <a href="#" className="btn-orange">LinkedIn</a>
          </div>
          <p className="mt-3 text-sm text-gray-600">Links can be connected as our official accounts are finalized.</p>

          <h4 className="mt-6 text-xl font-bold text-[#002b49]">Let’s Inspire More People Together</h4>
          <p className="mt-2 text-base leading-7 text-[#516b7d]">If you create content about Pick It Up Seattle, we’d love to see it.</p>
          <p className="mt-2 text-base leading-7 text-[#516b7d]">Share a link to your post, video, article, podcast, or project so we can celebrate your work and inspire even more people to join the movement.</p>

          <button type="button" onClick={() => setShowAmbassadorForm((current) => !current)} className="btn-primary mt-6">
            Share Your Content
          </button>

          {showAmbassadorForm ? (
            <form className="mt-6 space-y-4" action={SITE_CONTACT_MAILTO} method="post" encType="text/plain">
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-gray-700">Name</span>
                <input name="name" type="text" required className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-seattle-green" />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-gray-700">Email</span>
                <input name="email" type="email" required className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-seattle-green" />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-gray-700">Link to your content</span>
                <input name="contentLink" type="url" required className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-seattle-green" />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-gray-700">Optional message</span>
                <textarea name="message" rows="4" className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-seattle-green" />
              </label>
              <button type="submit" className="btn-primary">Submit</button>
              <p className="text-xs text-gray-600">This form is prepared for future connection to {SITE_CONTACT_EMAIL}.</p>
            </form>
          ) : null}
        </div>
      );
    }

    if (activePanel === 'photography-stories') {
      return (
        <div className="rounded-2xl border border-[#0f9aa1]/18 bg-white p-6 shadow-[0_14px_30px_rgba(0,43,73,0.1)] sm:p-8">
          <h3 className="text-2xl font-bold text-[#002b49]">Photography & Stories</h3>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/volunteer-memorable-photos" className="btn-secondary">Share Community Photos</Link>
            <Link href="/blog#share-your-story" className="btn-aqua">Submit a Story</Link>
            <button type="button" onClick={() => setShowPhotographerForm((current) => !current)} className="btn-warm">
              Volunteer as an Event Photographer
            </button>
          </div>

          {showPhotographerForm ? (
            <form className="mt-6 space-y-4" action={SITE_CONTACT_MAILTO} method="post" encType="text/plain">
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-gray-700">Name</span>
                <input name="name" type="text" required className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-seattle-green" />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-gray-700">Email</span>
                <input name="email" type="email" required className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-seattle-green" />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-gray-700">Message</span>
                <textarea name="message" rows="4" required className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-seattle-green" />
              </label>
              <button type="submit" className="btn-primary">Submit</button>
              <p className="text-xs text-gray-600">This form is prepared for future connection to {SITE_CONTACT_EMAIL}.</p>
            </form>
          ) : null}
        </div>
      );
    }

    if (activePanel === 'community-partner') {
      return (
        <div className="rounded-2xl border border-[#0f9aa1]/18 bg-white p-6 shadow-[0_14px_30px_rgba(0,43,73,0.1)] sm:p-8">
          <form className="space-y-4" action={SITE_CONTACT_MAILTO} method="post" encType="text/plain">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Organization or Business</span>
              <input name="organization" type="text" required className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-seattle-green" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Contact Name</span>
              <input name="contactName" type="text" required className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-seattle-green" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Email</span>
              <input name="email" type="email" required className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-seattle-green" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Phone (optional)</span>
              <input name="phone" type="tel" className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-seattle-green" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Type of Organization</span>
              <input name="organizationType" type="text" required className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-seattle-green" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">How would you like to partner?</span>
              <textarea name="partnershipIdea" rows="3" required className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-seattle-green" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Message</span>
              <textarea name="message" rows="4" required className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-seattle-green" />
            </label>
            <button type="submit" className="btn-primary">Submit</button>
            <p className="text-xs text-gray-600">This form is prepared for future connection to {SITE_CONTACT_EMAIL}.</p>
          </form>
        </div>
      );
    }

    if (activePanel === 'creative-team') {
      return (
        <div className="rounded-2xl border border-[#0f9aa1]/18 bg-white p-6 shadow-[0_14px_30px_rgba(0,43,73,0.1)] sm:p-8">
          <h3 className="text-2xl font-bold text-[#002b49]">Have an Idea?</h3>
          <p className="mt-3 text-base leading-7 text-[#516b7d]">Great ideas help movements grow. We’d love to hear yours.</p>
          <form className="mt-6 space-y-4" action={SITE_CONTACT_MAILTO} method="post" encType="text/plain">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Name</span>
              <input name="name" type="text" required className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-seattle-green" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Email</span>
              <input name="email" type="email" required className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-seattle-green" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Area of Interest</span>
              <input name="interestArea" type="text" required className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-seattle-green" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Tell us your idea</span>
              <textarea name="idea" rows="4" required className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-seattle-green" />
            </label>
            <button type="submit" className="btn-primary">Submit</button>
            <p className="text-xs text-gray-600">This form is prepared for future connection to {SITE_CONTACT_EMAIL}.</p>
          </form>
        </div>
      );
    }

    return (
      <div className="rounded-2xl border border-[#0f9aa1]/18 bg-white p-6 shadow-[0_14px_30px_rgba(0,43,73,0.1)] sm:p-8">
        <h3 className="text-2xl font-bold text-[#002b49]">How Would You Like to Help?</h3>
        <form className="mt-6 space-y-4" action={SITE_CONTACT_MAILTO} method="post" encType="text/plain">
          <fieldset className="space-y-2">
            <legend className="mb-2 block text-sm font-medium text-gray-700">Select all that apply</legend>
            {[
              'Donate',
              'Sponsor cleanup supplies',
              'Sponsor volunteer shirts or hats',
              'Offer professional services',
              'Help with outreach',
              'Other',
            ].map((item) => (
              <label key={item} className="flex items-center gap-3 text-gray-700">
                <input type="checkbox" name="supportOptions" value={item} className="h-4 w-4 rounded text-seattle-green" />
                <span>{item}</span>
              </label>
            ))}
          </fieldset>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Name</span>
            <input name="name" type="text" required className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-seattle-green" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Email</span>
            <input name="email" type="email" required className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-seattle-green" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Message</span>
            <textarea name="message" rows="4" required className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-seattle-green" />
          </label>
          <button type="submit" className="btn-primary">Submit</button>
          <p className="text-xs text-gray-600">This form is prepared for future connection to {SITE_CONTACT_EMAIL}.</p>
        </form>
      </div>
    );
  };


  return (
    <>
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-r from-seattle-green to-green-700 text-white py-16">
        <div className="container-custom">
          <h1 className="heading-xl mb-4 text-[#0f9aa1]">Join the Movement</h1>
          <div className="max-w-4xl space-y-4 text-[1.12rem] font-semibold leading-relaxed text-[#002244] sm:text-xl">
            <p>Pick It Up Seattle isn’t built by one organization. It’s built by thousands of people doing one small thing to make our city better.</p>
            <p>Whether you pick up litter, organize a cleanup, share a social media post, invite a friend, photograph an event, become a community partner, or simply encourage others, you’re helping build something much bigger than yourself.</p>
            <p>Every person has something valuable to contribute.</p>
          </div>
        </div>
      </section>

      {/* Volunteer Types */}
      <section className="bg-[linear-gradient(180deg,_#fff9eb_0%,_#f6fcff_100%)] py-16">
        <div className="container-custom">
          <div className="mx-auto max-w-6xl">
            <h2 className="heading-lg mb-4 text-center text-[#0f9aa1]">Ways to Make a Difference</h2>
            <p className="mx-auto mb-12 max-w-4xl text-center text-lg leading-relaxed text-[#1f5f7a]">
              There are many ways to take part in the movement, and every one of them helps move Seattle forward.
            </p>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {participationOptions.map((option, index) => renderCard(option, index))}
            </div>

          </div>
        </div>
      </section>

      {activePanel ? (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-[#002244]/45 p-4 backdrop-blur-[1px]"
          onClick={closeModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Ways to Make a Difference details"
            className="relative w-full max-w-5xl overflow-hidden rounded-2xl border border-[#0f9aa1]/24 bg-[#fffaf0] shadow-[0_24px_70px_rgba(0,43,73,0.35)]"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeModal}
              className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#0f9aa1]/25 bg-white text-2xl leading-none text-[#002b49] shadow-[0_8px_18px_rgba(0,43,73,0.12)] hover:bg-[#f1fbfc]"
              aria-label="Close dialog"
            >
              ×
            </button>

            <div className="max-h-[86vh] overflow-y-auto p-5 sm:p-7">
              {renderActivePanel()}

              <div className="mt-6 flex justify-end">
                <button type="button" onClick={closeModal} className="btn-secondary">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <Footer />
    </>
  );
}
