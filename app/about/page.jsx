import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function About() {
  const team = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & Executive Director',
      image: '👩‍💼',
      bio: 'Community organizer passionate about environmental action',
    },
    {
      name: 'Marcus Chen',
      role: 'Events Coordinator',
      image: '👨‍💼',
      bio: 'Brings Seattle neighborhoods together through events',
    },
    {
      name: 'Elena Rodriguez',
      role: 'Community Outreach',
      image: '👩‍💼',
      bio: 'Connects with local businesses and organizations',
    },
    {
      name: 'James Park',
      role: 'Operations Manager',
      image: '👨‍💼',
      bio: 'Ensures every cleanup runs smoothly and safely',
    },
  ];

  return (
    <>
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-r from-seattle-green to-green-700 text-white py-16">
        <div className="container-custom">
          <h1 className="heading-xl mb-4">About Pick It Up Seattle</h1>
          <p className="text-lg text-green-100">
            Our story, our values, and our vision for Seattle
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 sm:py-24">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="heading-lg mb-8">Our Story</h2>
            <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
              <p>
                Pick It Up Seattle started in 2023 with a simple idea: make it easy and fun for people
                to make their neighborhoods cleaner and more beautiful. What began as a small group of
                friends cleaning up their local park has grown into a movement with hundreds of
                volunteers.
              </p>
              <p>
                We believe that environmental change starts with individuals taking action in their
                own communities. Every piece of trash picked up, every park beautified, and every
                neighborhood cleaned makes Seattle better for everyone.
              </p>
              <p>
                Today, Pick It Up Seattle hosts regular events across the city, from Green Lake to
                Ballard, from Capitol Hill to the Eastside. We\' ve removed tons of litter, connected
                hundreds of community members, and proven that when we work together, we can create
                real change.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="container-custom">
          <h2 className="heading-lg mb-12 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: '🌍',
                title: 'Environmental Stewardship',
                description: 'Protecting and preserving Seattle\' s natural beauty for future generations',
              },
              {
                icon: '🤝',
                title: 'Community First',
                description: 'Bringing people together to achieve more than we could alone',
              },
              {
                icon: '✨',
                title: 'Fun & Inclusive',
                description: 'Making cleanup enjoyable and welcoming for everyone',
              },
              {
                icon: '📈',
                title: 'Impact Driven',
                description: 'Measuring and celebrating the real difference we make',
              },
            ].map((value, idx) => (
              <div key={idx} className="bg-white p-8 rounded-lg shadow-md text-center">
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-seattle-green">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 sm:py-24">
        <div className="container-custom">
          <h2 className="heading-lg mb-12 text-center">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, idx) => (
              <div key={idx} className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition">
                <div className="text-6xl mb-4">{member.image}</div>
                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                <p className="text-seattle-green font-semibold mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* By the Numbers */}
      <section className="py-16 sm:py-24 bg-seattle-green text-white">
        <div className="container-custom">
          <h2 className="heading-lg mb-12 text-center">By the Numbers</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">500+</div>
              <p className="text-green-100">Active Volunteers</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">50+</div>
              <p className="text-green-100">Events Hosted</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">10</div>
              <p className="text-green-100">Tons of Trash Collected</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">25</div>
              <p className="text-green-100">Seattle Neighborhoods</p>
            </div>
          </div>
        </div>
      </section>

      {/* Partnerships */}
      <section className="py-16 sm:py-24">
        <div className="container-custom">
          <h2 className="heading-lg mb-12 text-center">Our Partners</h2>
          <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
            We work with amazing organizations to make Seattle cleaner and more beautiful
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              'Seattle Parks & Recreation',
              'Washington Environmental Council',
              'Local Neighborhood Associations',
              'Green Seattle Partnership',
              'University of Washington Sustainability',
              'Seattle Audubon Society',
            ].map((partner, idx) => (
              <div key={idx} className="bg-gray-50 p-6 rounded-lg text-center border border-gray-200">
                <p className="font-semibold text-gray-800">{partner}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-y border-[#0f9aa1]/40 bg-[linear-gradient(125deg,_#9ddfeb_0%,_#82d9e8_40%,_#c7eecf_72%,_#ffd89f_100%)] py-16 text-[#002B49] sm:py-24">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-bold mb-6">Join Our Movement</h2>
          <p className="text-xl mb-8 text-[#114b66] max-w-2xl mx-auto">
            Help us make Seattle cleaner, one event at a time. Whether you volunteer, donate, or
            spread the word, you\' re part of the solution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/volunteer" className="inline-flex items-center justify-center rounded-full bg-[#69BE28] px-6 py-3 font-semibold text-[#002B49] shadow-[0_10px_24px_rgba(105,190,40,0.34)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#7fd33e]">
              Volunteer Now
            </Link>
            <Link href="/donate" className="inline-flex items-center justify-center rounded-full border-2 border-[#0f9aa1]/75 bg-[#fff3cf] px-6 py-3 font-semibold text-[#006f8f] shadow-[0_10px_24px_rgba(0,111,143,0.2)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-white">
              Support Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
