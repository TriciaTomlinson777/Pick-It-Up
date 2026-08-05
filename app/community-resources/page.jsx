import Header from '@/components/Header';
import Footer from '@/components/Footer';

const resourceGroups = [
  {
    title: 'REPORT A PROBLEM',
    links: [
      {
        label: 'Find It, Fix It - Seattle',
        href: 'https://www.seattle.gov/customer-service-bureau/find-it-fix-it-mobile-app',
      },
      {
        label: 'Report Graffiti',
        href: 'https://www.seattle.gov/customer-service-bureau/find-it-fix-it-mobile-app',
      },
      {
        label: 'Report Illegal Dumping',
        href: 'https://www.seattle.gov/customer-service-bureau/find-it-fix-it-mobile-app',
      },
      {
        label: 'Report Abandoned Vehicles',
        href: 'https://www.seattle.gov/customer-service-bureau/find-it-fix-it-mobile-app',
      },
    ],
  },
  {
    title: 'RECYCLING & DISPOSAL',
    links: [
      {
        label: 'Seattle Public Utilities Recycling',
        href: 'https://www.seattle.gov/utilities',
      },
      {
        label: 'Household Hazardous Waste',
        href: 'https://kingcountyhazwastewa.gov',
      },
    ],
  },
  {
    title: 'PARKS & TRAILS',
    links: [
      {
        label: 'Seattle Parks & Recreation',
        href: 'https://www.seattle.gov/parks',
      },
      {
        label: 'Green Seattle Partnership',
        href: 'https://greenseattle.org',
      },
    ],
  },
  {
    title: 'TRANSPORTATION',
    links: [
      {
        label: 'King County Metro',
        href: 'https://kingcounty.gov/metro',
      },
      {
        label: 'Sound Transit',
        href: 'https://www.soundtransit.org',
      },
    ],
  },
  {
    title: 'COMMUNITY',
    links: [
      {
        label: 'Seattle Neighborhood Greenways',
        href: 'https://seattlegreenways.org',
      },
      {
        label: 'Keep America Beautiful',
        href: 'https://kab.org',
      },
    ],
  },
];

export default function CommunityResources() {
  return (
    <>
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-r from-seattle-green to-green-700 text-white py-16">
        <div className="container-custom">
          <h1 className="heading-xl mb-4 text-[#0f9aa1]">Community Resources</h1>
          <p className="text-lg text-green-100">
            Trusted Seattle resources to help residents care for and improve our city.
          </p>
        </div>
      </section>

      {/* Resources */}
      <section className="py-16 sm:py-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {resourceGroups.map((group, index) => {
              const headingColors = ['text-[#ef7f2d]', 'text-[#0f9aa1]', 'text-[#61b826]', 'text-[#f4c94c]', 'text-[#1fb8c2]'];

              return (
              <section key={group.title} className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition">
                <h2 className={`mb-5 text-xl font-bold tracking-wide ${headingColors[index % headingColors.length]}`}>
                  {group.title}
                </h2>
                <ul className="space-y-3">
                  {group.links.map((resource) => (
                    <li key={resource.label}>
                      <a
                        href={resource.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-700 font-medium hover:text-seattle-green hover:underline"
                      >
                        {resource.label} <span aria-hidden="true">↗</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
