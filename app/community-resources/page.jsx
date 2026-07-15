import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CommunityResources() {
  return (
    <>
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-r from-seattle-green to-green-700 text-white py-16">
        <div className="container-custom">
          <h1 className="heading-xl mb-4">Community Resources</h1>
          <p className="text-lg text-green-100">
            Helpful guides and resources for sustainable living in Seattle
          </p>
        </div>
      </section>

      {/* Resources */}
      <section className="py-16 sm:py-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Recycling Guide */}
            <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition">
              <div className="text-5xl mb-4">♻️</div>
              <h3 className="text-2xl font-bold mb-4 text-seattle-green">Seattle Recycling Guide</h3>
              <p className="text-gray-600 mb-4">
                Learn what can and can\' t be recycled in Seattle\' s curbside program.
              </p>
              <a
                href="https://www.seattle.gov/utilities/recycling"
                target="_blank"
                rel="noopener noreferrer"
                className="text-seattle-green font-semibold hover:underline"
              >
                Visit Seattle.gov →
              </a>
            </div>

            {/* Composting */}
            <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition">
              <div className="text-5xl mb-4">🌱</div>
              <h3 className="text-2xl font-bold mb-4 text-seattle-green">Composting Options</h3>
              <p className="text-gray-600 mb-4">
                Discover how to compost at home or find community composting options.
              </p>
              <a
                href="https://www.seattle.gov/utilities/compost"
                target="_blank"
                rel="noopener noreferrer"
                className="text-seattle-green font-semibold hover:underline"
              >
                Learn More →
              </a>
            </div>

            {/* Parks & Nature */}
            <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition">
              <div className="text-5xl mb-4">🏞️</div>
              <h3 className="text-2xl font-bold mb-4 text-seattle-green">Seattle Parks</h3>
              <p className="text-gray-600 mb-4">
                Explore Seattle\' s beautiful parks, trails, and natural areas.
              </p>
              <a
                href="https://www.seattle.gov/parks"
                target="_blank"
                rel="noopener noreferrer"
                className="text-seattle-green font-semibold hover:underline"
              >
                Discover Parks →
              </a>
            </div>

            {/* Water Quality */}
            <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition">
              <div className="text-5xl mb-4">💧</div>
              <h3 className="text-2xl font-bold mb-4 text-seattle-green">Water Quality</h3>
              <p className="text-gray-600 mb-4">
                Learn about Seattle\' s waterways and how to protect them.
              </p>
              <a
                href="https://www.ecology.wa.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="text-seattle-green font-semibold hover:underline"
              >
                WA Ecology →
              </a>
            </div>

            {/* Environmental Organizations */}
            <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition">
              <div className="text-5xl mb-4">🌍</div>
              <h3 className="text-2xl font-bold mb-4 text-seattle-green">Environmental Groups</h3>
              <p className="text-gray-600 mb-4">
                Connect with other environmental organizations in Seattle.
              </p>
              <a
                href="https://www.wec.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-seattle-green font-semibold hover:underline"
              >
                Washington Environmental Council →
              </a>
            </div>

            {/* Sustainable Shopping */}
            <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition">
              <div className="text-5xl mb-4">🛍️</div>
              <h3 className="text-2xl font-bold mb-4 text-seattle-green">Sustainable Shopping</h3>
              <p className="text-gray-600 mb-4">
                Find local businesses promoting sustainable practices in Seattle.
              </p>
              <a
                href="#"
                className="text-seattle-green font-semibold hover:underline"
              >
                Learn More →
              </a>
            </div>
          </div>

          {/* Local Tips */}
          <div className="bg-gray-50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-seattle-green">Seattle Sustainability Tips</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-seattle-green font-bold mr-3">💡</span>
                <span>Use public transportation, bike, or carpool to reduce emissions</span>
              </li>
              <li className="flex items-start">
                <span className="text-seattle-green font-bold mr-3">💡</span>
                <span>Shop local at Pike Place Market and neighborhood farmers markets</span>
              </li>
              <li className="flex items-start">
                <span className="text-seattle-green font-bold mr-3">💡</span>
                <span>Bring reusable bags when shopping</span>
              </li>
              <li className="flex items-start">
                <span className="text-seattle-green font-bold mr-3">💡</span>
                <span>Reduce water usage, especially during dry summers</span>
              </li>
              <li className="flex items-start">
                <span className="text-seattle-green font-bold mr-3">💡</span>
                <span>Support local green businesses and certified sustainable companies</span>
              </li>
              <li className="flex items-start">
                <span className="text-seattle-green font-bold mr-3">💡</span>
                <span>Participate in neighborhood cleanup events like ours!</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
