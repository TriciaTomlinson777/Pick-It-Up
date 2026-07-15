import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function Volunteer() {
  return (
    <>
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-r from-seattle-green to-green-700 text-white py-16">
        <div className="container-custom">
          <h1 className="heading-xl mb-4">Become a Volunteer</h1>
          <p className="text-lg text-green-100">
            Join hundreds of passionate community members making Seattle cleaner
          </p>
        </div>
      </section>

      {/* Sign Up Form */}
      <section className="py-16 sm:py-24">
        <div className="container-custom max-w-2xl">
          <form className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-8">Volunteer Sign-Up</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-seattle-green"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-seattle-green"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-seattle-green"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-seattle-green"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Which neighborhoods interest you? *
              </label>
              <div className="space-y-2">
                {[
                  'Green Lake',
                  'Capitol Hill',
                  'Ballard',
                  'Magnolia',
                  'Queen Anne',
                  'Pike Place',
                  'University District',
                  'Fremont',
                ].map((neighborhood) => (
                  <label key={neighborhood} className="flex items-center">
                    <input
                      type="checkbox"
                      value={neighborhood}
                      className="w-4 h-4 text-seattle-green rounded"
                    />
                    <span className="ml-3 text-gray-700">{neighborhood}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How often can you volunteer? *
              </label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-seattle-green">
                <option>- Select -</option>
                <option>Weekly</option>
                <option>Bi-weekly</option>
                <option>Monthly</option>
                <option>Occasionally</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience Level
              </label>
              <div className="space-y-2">
                {[
                  { value: 'new', label: 'New to volunteering' },
                  { value: 'experienced', label: 'Some volunteer experience' },
                  { value: 'leader', label: 'Interested in leading events' },
                ].map((option) => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="radio"
                      name="experience"
                      value={option.value}
                      className="w-4 h-4 text-seattle-green"
                    />
                    <span className="ml-3 text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Any special skills or interests?
              </label>
              <textarea
                rows="4"
                placeholder="Photography, social media, event planning, etc."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-seattle-green"
              ></textarea>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How did you hear about Pick It Up?
              </label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-seattle-green">
                <option>- Select -</option>
                <option>Social Media</option>
                <option>Friend/Family</option>
                <option>Community Event</option>
                <option>Search Engine</option>
                <option>Local News</option>
                <option>Other</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  required
                  className="w-4 h-4 text-seattle-green rounded mt-1"
                />
                <span className="ml-3 text-gray-700">
                  I agree to receive event updates and news from Pick It Up Seattle
                </span>
              </label>
            </div>

            <div className="mb-6">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  required
                  className="w-4 h-4 text-seattle-green rounded mt-1"
                />
                <span className="ml-3 text-gray-700">
                  I have read and agree to the Volunteer Code of Conduct
                </span>
              </label>
            </div>

            <button type="submit" className="btn-primary w-full">
              Sign Up to Volunteer
            </button>
          </form>
        </div>
      </section>

      {/* Volunteer Types */}
      <section className="bg-gray-50 py-16">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-12 text-center">Volunteer Opportunities</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">🚶</div>
              <h3 className="text-xl font-bold mb-2 text-seattle-green">Event Participant</h3>
              <p className="text-gray-600">
                Show up to cleanup events, work with teams, and help remove trash from Seattle\' s
                neighborhoods.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-bold mb-2 text-seattle-green">Event Leader</h3>
              <p className="text-gray-600">
                Help organize and lead cleanup events in your neighborhood. We provide all training
                and support.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-bold mb-2 text-seattle-green">Virtual Support</h3>
              <p className="text-gray-600">
                Help with social media, photography, marketing, data entry, and other remote
                opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-12 text-center">Volunteer Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {[
              'Make a real environmental impact',
              'Meet like-minded community members',
              'Free Pick It Up merchandise',
              'Build valuable volunteer experience',
              'Support local neighborhoods',
              'Have fun while doing good',
              'Connect with local organizations',
              'Be part of a growing movement',
            ].map((benefit, idx) => (
              <div key={idx} className="flex items-start">
                <span className="text-seattle-green text-2xl mr-3">✓</span>
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
