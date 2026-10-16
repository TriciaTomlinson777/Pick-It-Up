import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

const donationUrl = 'https://donate.stripe.com/dRmcN65pl2TC7X76JggQE00';

export default function Donate() {

  return (
    <>
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-r from-seattle-green to-green-700 text-white py-16">
        <div className="container-custom text-center">
          <h1 className="text-[#1f5f7a] heading-xl mb-4">Help communities care for the places they call home</h1>
          <p className="text-lg sm:text-xl font-semibold text-seattle-blue mt-4">
            Your donation helps inspire cleaner communities
          </p>
        </div>
      </section>

      {/* Donation Info */}
      <section className="py-16 sm:py-24">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-6 text-center">What We’re Doing</h2>
            <p className="text-lg text-gray-700 mb-6">
              Pick It Up Seattle brings people together through litter cleanup, children’s
              environmental education, and everyday acts of community care. We’re creating books,
              activities, and engaging ways to help children and families turn caring into action.
            </p>
            <p className="text-lg text-gray-700 mb-6">
              Your donation helps us create and share these resources, reach more communities,
              and encourage lasting habits that keep shared places clean.
            </p>
            <p className="text-lg font-semibold text-seattle-green">
              Every gift helps move this work forward.
            </p>
          </div>
        </div>
      </section>

      {/* Donation choices */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="container-custom text-center max-w-3xl">
          <h2 className="text-3xl font-bold mb-6">Give What Works for You</h2>
          <p className="text-gray-700 mb-6">
            Suggested gifts: $10 · $25 · $50 · $100 · Any amount
          </p>
          <a href={donationUrl} className="btn-primary inline-block">Donate</a>
          <p className="text-sm text-gray-600 mt-4">
            Choose your amount on our secure Stripe payment page.
          </p>
          <p className="text-gray-600 mt-6">
            For ongoing support or a gift in someone’s honor,{' '}
            <Link href="/contact?subject=Giving" className="underline text-seattle-green">contact us</Link>.
          </p>
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
                Donations help us create and share books, activities, and environmental education
                resources, reach more communities, and encourage litter cleanup and everyday
                community care.
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
