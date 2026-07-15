import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function Donate() {
  const donationTiers = [
    {
      amount: '$10',
      description: 'Supplies one volunteer with gloves and tools',
      impact: 'One Volunteer Support',
    },
    {
      amount: '$25',
      description: 'Provides supplies for a small cleanup team',
      impact: 'Small Team',
    },
    {
      amount: '$50',
      description: 'Hosts a complete neighborhood cleanup event',
      impact: 'Full Event',
    },
    {
      amount: '$100',
      description: 'Supports monthly community cleanups',
      impact: 'Monthly Series',
    },
  ];

  return (
    <>
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-r from-seattle-green to-green-700 text-white py-16">
        <div className="container-custom">
          <h1 className="heading-xl mb-4">Support Our Mission</h1>
          <p className="text-lg text-green-100">
            Your donation helps us keep Seattle clean and beautiful
          </p>
        </div>
      </section>

      {/* Donation Info */}
      <section className="py-16 sm:py-24">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-6 text-center">Why Donate?</h2>
            <p className="text-lg text-gray-700 mb-6">
              100% of donations go directly to our mission of making Seattle cleaner and more
              beautiful. Your contribution helps us:
            </p>
            <ul className="space-y-4">
              {[
                'Purchase and maintain cleanup supplies (gloves, trash bags, grabbers)',
                'Organize regular events across Seattle neighborhoods',
                'Provide training and support for volunteer leaders',
                'Expand our reach to new neighborhoods and communities',
                'Create educational materials about sustainability',
                'Partner with local organizations and parks',
              ].map((item, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-seattle-green text-2xl mr-3 mt-1">✓</span>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Donation Tiers */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-12 text-center">Donation Levels</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {donationTiers.map((tier, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition text-center"
              >
                <div className="text-4xl font-bold text-seattle-green mb-2">{tier.amount}</div>
                <p className="text-sm text-seattle-accent font-semibold mb-3">{tier.impact}</p>
                <p className="text-gray-600 text-sm mb-6">{tier.description}</p>
                <button className="btn-primary w-full py-2">Donate</button>
              </div>
            ))}
          </div>

          {/* Custom Donation */}
          <div className="text-center">
            <p className="text-gray-600 mb-4">Or donate a custom amount:</p>
            <div className="flex justify-center gap-4">
              <input
                type="number"
                placeholder="Enter amount"
                className="px-4 py-2 border border-gray-300 rounded-lg w-48 focus:outline-none focus:ring-2 focus:ring-seattle-green"
              />
              <button className="btn-primary">Donate Now</button>
            </div>
          </div>
        </div>
      </section>

      {/* Ways to Give */}
      <section className="py-16 sm:py-24">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-12 text-center">Ways to Give</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition">
              <div className="text-5xl mb-4">💳</div>
              <h3 className="text-xl font-bold mb-3 text-seattle-green">One-Time Donation</h3>
              <p className="text-gray-600 mb-4">
                Make a single donation when it works best for you
              </p>
              <button className="btn-primary text-sm">Donate Now</button>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition">
              <div className="text-5xl mb-4">📅</div>
              <h3 className="text-xl font-bold mb-3 text-seattle-green">Monthly Giving</h3>
              <p className="text-gray-600 mb-4">
                Become a sustaining supporter with a recurring monthly donation
              </p>
              <button className="btn-primary text-sm">Set Up Monthly</button>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition">
              <div className="text-5xl mb-4">🎁</div>
              <h3 className="text-xl font-bold mb-3 text-seattle-green">Give in Honor</h3>
              <p className="text-gray-600 mb-4">
                Make a donation in honor of someone special
              </p>
              <button className="btn-primary text-sm">Honor a Person</button>
            </div>
          </div>
        </div>
      </section>

      {/* Tax Info */}
      <section className="bg-blue-50 border-l-4 border-seattle-blue p-8 mb-16">
        <div className="container-custom">
          <h3 className="font-bold text-seattle-blue mb-2">Tax-Deductible Donations</h3>
          <p className="text-gray-700">
            Pick It Up Seattle is a registered 501(c)(3) nonprofit organization. Your donations are
            tax-deductible to the extent allowed by law. Tax ID: 12-3456789
          </p>
        </div>
      </section>

      {/* Corporate Partnerships */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-8 text-center">Corporate Partnerships</h2>
          <p className="text-lg text-gray-700 mb-8 text-center max-w-2xl mx-auto">
            Local businesses and corporations can support Pick It Up Seattle through sponsorships,
            employee giving programs, and in-kind donations.
          </p>
          <div className="text-center">
            <Link href="/contact?subject=Corporate%20Partnership" className="btn-secondary">
              Learn About Corporate Giving
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-24">
        <div className="container-custom max-w-2xl">
          <h2 className="text-3xl font-bold mb-8 text-center">Donation FAQ</h2>
          <div className="space-y-4">
            <details className="bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-gray-100 transition">
              <summary className="font-bold text-seattle-green">Is Pick It Up Seattle a nonprofit?</summary>
              <p className="text-gray-700 mt-2">
                Yes, we are a registered 501(c)(3) nonprofit organization. Donations are
                tax-deductible.
              </p>
            </details>
            <details className="bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-gray-100 transition">
              <summary className="font-bold text-seattle-green">How are donations used?</summary>
              <p className="text-gray-700 mt-2">
                100% of donations go to supplies, event organization, training, and community
                outreach.
              </p>
            </details>
            <details className="bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-gray-100 transition">
              <summary className="font-bold text-seattle-green">Can I donate items instead of money?</summary>
              <p className="text-gray-700 mt-2">
                Yes! We accept donations of supplies like gloves, trash bags, and tools. Contact us
                to learn more.
              </p>
            </details>
            <details className="bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-gray-100 transition">
              <summary className="font-bold text-seattle-green">What payment methods do you accept?</summary>
              <p className="text-gray-700 mt-2">
                We accept credit cards, PayPal, bank transfers, and checks. Contact us for details.
              </p>
            </details>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
