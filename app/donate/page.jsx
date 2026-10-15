import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

const donationUrl = 'https://donate.stripe.com/dRmcN65pl2TC7X76JggQE00';

export default function Donate() {
  const donationTiers = [
    {
      amount: '$10',
      description: 'Supports cleaner communities',
      impact: 'Every Gift Matters',
    },
    {
      amount: '$25',
      description: 'Supports environmental education',
      impact: 'Inspire Learning',
    },
    {
      amount: '$50',
      description: 'Supports litter cleanup and community participation',
      impact: 'Encourage Action',
    },
    {
      amount: '$100',
      description: 'Supports community outreach and mission-focused activities',
      impact: 'Grow Our Impact',
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
            Your donation helps inspire cleaner communities
          </p>
        </div>
      </section>

      {/* Donation Info */}
      <section className="py-16 sm:py-24">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-6 text-center">Why Donate?</h2>
            <p className="text-lg text-gray-700 mb-6">
              Help keep communities clean and inspire children to care for the places they live.
              Your donation supports litter cleanup, environmental education, and community participation.
            </p>
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
                <a href={donationUrl} className="btn-primary inline-block w-full py-2" aria-label={`Donate — suggested amount ${tier.amount}`}>Donate</a>
              </div>
            ))}
          </div>

          {/* Custom Donation */}
          <div className="text-center">
            <p className="text-gray-600 mb-4">Or donate a custom amount:</p>
            <a href={donationUrl} className="btn-primary inline-block">Choose Your Donation Amount</a>
            <p className="text-sm text-gray-600 mt-4">Enter your amount on our secure Stripe payment page.</p>
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
              <a href={donationUrl} className="btn-primary inline-block text-sm">Donate Now</a>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition">
              <div className="text-5xl mb-4">📅</div>
              <h3 className="text-xl font-bold mb-3 text-seattle-green">Monthly Giving</h3>
              <p className="text-gray-600 mb-4">
                Contact us to discuss ongoing support for cleaner communities
              </p>
              <Link href="/contact?subject=Monthly%20Giving" className="btn-primary inline-block text-sm">Ask About Monthly Giving</Link>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition">
              <div className="text-5xl mb-4">🎁</div>
              <h3 className="text-xl font-bold mb-3 text-seattle-green">Give in Honor</h3>
              <p className="text-gray-600 mb-4">
                Make a donation in honor of someone special
              </p>
              <Link href="/contact?subject=Donation%20in%20Honor" className="btn-primary inline-block text-sm">Arrange an Honor Gift</Link>
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
            tax-deductible to the extent allowed by law.
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
                Your donation supports litter cleanup, environmental education, and community
                participation—helping keep communities clean and inspiring children to care
                for the places they live.
              </p>
            </details>
            <details className="bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-gray-100 transition">
              <summary className="font-bold text-seattle-green">Can I donate items instead of money?</summary>
              <p className="text-gray-700 mt-2">
                Yes! Contact us to discuss supplies or other in-kind gifts that support
                litter cleanup, environmental education, and community participation.
              </p>
            </details>
            <details className="bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-gray-100 transition">
              <summary className="font-bold text-seattle-green">What payment methods do you accept?</summary>
              <p className="text-gray-700 mt-2">
                Use our secure Stripe payment page to donate by card. Available payment options are shown at checkout. Contact us about other ways to give.
              </p>
            </details>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
