import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function Events() {
  const events = [
    {
      id: 'green-lake-cleanup',
      title: 'Green Lake Cleanup',
      date: 'Saturday, July 20',
      time: '9:00 AM - 12:00 PM',
      location: 'Green Lake Park, Seattle',
      description:
        'Join us for a morning cleanup around Green Lake. We\' ll focus on removing litter from the walking path and surrounding areas.',
      attendees: 45,
      image: '🌳',
    },
    {
      id: 'discovery-park-trail',
      title: 'Discovery Park Trail Work',
      date: 'Sunday, July 21',
      time: '10:00 AM - 1:00 PM',
      location: 'Discovery Park, Magnolia',
      description:
        'Help maintain and beautify trails at Discovery Park. We\' ll be focusing on light trail maintenance and trash removal.',
      attendees: 32,
      image: '🏞️',
    },
    {
      id: 'capitol-hill',
      title: 'Capitol Hill Community Day',
      date: 'Saturday, July 27',
      time: '2:00 PM - 5:00 PM',
      location: 'Capitol Hill Community Center',
      description:
        'Light cleanup and community gathering in the heart of Capitol Hill. Great for meeting other volunteers!',
      attendees: 28,
      image: '🌸',
    },
    {
      id: 'pike-place-cleanup',
      title: 'Pike Place Market Area Cleanup',
      date: 'Saturday, August 3',
      time: '8:00 AM - 10:00 AM',
      location: 'Pike Place Market, Downtown',
      description:
        'Early morning cleanup around the iconic Pike Place Market. Perfect for a quick volunteer opportunity!',
      attendees: 38,
      image: '🌟',
    },
    {
      id: 'ballard-locks',
      title: 'Ballard Locks Park Cleanup',
      date: 'Sunday, August 4',
      time: '11:00 AM - 2:00 PM',
      location: 'Ballard Locks, Ballard',
      description:
        'Help us clean up the beautiful area around the Ballard Locks. Enjoy Seattle\' s engineering while doing good!',
      attendees: 25,
      image: '⚙️',
    },
    {
      id: 'magnolia-beach',
      title: 'Magnolia Beach Cleanup',
      date: 'Saturday, August 10',
      time: '10:00 AM - 1:00 PM',
      location: 'Discovery Park Beach, Magnolia',
      description:
        'Beach cleanup focusing on removing marine litter and plastic. Bring sunscreen and your enthusiasm!',
      attendees: 42,
      image: '🏖️',
    },
  ];

  return (
    <>
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-r from-seattle-green to-green-700 text-white py-16">
        <div className="container-custom">
          <h1 className="heading-xl mb-4">Upcoming Events</h1>
          <p className="text-lg text-green-100">
            Find and join cleanup events across Seattle
          </p>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16 sm:py-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
              >
                <div className="bg-gradient-to-r from-seattle-green to-green-600 h-24 flex items-center justify-center">
                  <span className="text-4xl">{event.image}</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                  <div className="space-y-2 mb-4 text-sm text-gray-600">
                    <p>📅 {event.date}</p>
                    <p>⏰ {event.time}</p>
                    <p>📍 {event.location}</p>
                    <p>👥 {event.attendees} signed up</p>
                  </div>
                  <p className="text-gray-700 mb-6">{event.description}</p>
                  <Link
                    href={`/events/${event.id}`}
                    className="btn-primary block text-center"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-50 py-12">
        <div className="container-custom text-center">
          <h2 className="text-2xl font-bold mb-4">Can\' t find an event you like?</h2>
          <p className="text-gray-600 mb-6">
            Let us know what neighborhood or area you\' d like to see cleaned up!
          </p>
          <Link href="/contact" className="btn-secondary">
            Suggest an Event
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
