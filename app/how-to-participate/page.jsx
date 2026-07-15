import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function HowToParticipate() {
  return (
    <>
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-r from-seattle-green to-green-700 text-white py-16">
        <div className="container-custom">
          <h1 className="heading-xl mb-4">How to Participate</h1>
          <p className="text-lg text-green-100">
            Everything you need to know to make a difference with Pick It Up
          </p>
        </div>
      </section>

      {/* Getting Started */}
      <section className="py-16 sm:py-24">
        <div className="container-custom">
          <h2 className="heading-lg mb-12">Getting Started</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div className="bg-blue-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4 text-seattle-green">Step 1: Find an Event</h3>
              <p className="text-gray-700 leading-relaxed">
                Browse our events calendar to find a cleanup event that works for you. We host
                events throughout Seattle, from parks to neighborhoods to beaches. Whether you can
                give 1 hour or 4 hours, we have opportunities for everyone.
              </p>
              <Link href="/events" className="inline-block mt-4 text-seattle-green font-semibold hover:underline">
                View Events →
              </Link>
            </div>

            <div className="bg-green-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4 text-seattle-green">Step 2: Sign Up</h3>
              <p className="text-gray-700 leading-relaxed">
                Register for the event directly through our website or contact us. Let us know how
                many people will be joining, any special accessibility needs, and your preferred
                contact method. We\' ll send you all the details you need!
              </p>
              <Link href="/volunteer" className="inline-block mt-4 text-seattle-green font-semibold hover:underline">
                Volunteer Now →
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-accent-50 p-8 rounded-lg" style={{ backgroundColor: '#f0fdf4' }}>
              <h3 className="text-2xl font-bold mb-4 text-seattle-green">Step 3: Show Up!</h3>
              <p className="text-gray-700 leading-relaxed">
                Arrive a few minutes early. We provide all tools and supplies including trash bags,
                gloves, grabbers, and safety equipment. Just bring yourself, wear comfortable clothes,
                and be ready to make a difference!
              </p>
            </div>

            <div className="bg-yellow-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4 text-seattle-green">Step 4: Celebrate!</h3>
              <p className="text-gray-700 leading-relaxed">
                After cleanup, stick around to connect with other volunteers. We often gather to
                discuss the impact we\' ve made and celebrate our community. You\' ll also get a
                Pick It Up Seattle sticker as a thank you!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What to Bring */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="container-custom">
          <h2 className="heading-lg mb-12">What to Bring</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-bold mb-6">Essentials</h3>
              <ul className="space-y-3">
                {[
                  'Comfortable, closed-toe shoes',
                  'Weather-appropriate clothing',
                  'Sunscreen and hat',
                  'Reusable water bottle',
                  'Phone for emergencies',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-seattle-green font-bold mr-3 text-lg">✓</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-6">We Provide</h3>
              <ul className="space-y-3">
                {[
                  'Work gloves',
                  'Trash bags and grabbers',
                  'Safety equipment',
                  'Hand sanitizer and wipes',
                  'Snacks and refreshments',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-seattle-green font-bold mr-3 text-lg">✓</span>
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
          <h2 className="heading-lg mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6 max-w-3xl">
            <details className="bg-gray-50 p-6 rounded-lg cursor-pointer hover:bg-gray-100 transition">
              <summary className="font-bold text-lg text-seattle-green">
                Do I need prior experience?
              </summary>
              <p className="text-gray-700 mt-4">
                Not at all! Pick It Up is for everyone. We welcome people of all ages and
                experience levels. Whether it\' s your first cleanup or your hundredth, we\' re
                happy to have you.
              </p>
            </details>

            <details className="bg-gray-50 p-6 rounded-lg cursor-pointer hover:bg-gray-100 transition">
              <summary className="font-bold text-lg text-seattle-green">
                Can I bring my family or friends?
              </summary>
              <p className="text-gray-700 mt-4">
                Absolutely! We encourage families and groups. It\' s a great way to make a difference
                together. Just let us know how many people will be attending when you sign up.
              </p>
            </details>

            <details className="bg-gray-50 p-6 rounded-lg cursor-pointer hover:bg-gray-100 transition">
              <summary className="font-bold text-lg text-seattle-green">
                What if it rains?
              </summary>
              <p className="text-gray-700 mt-4">
                We proceed rain or shine unless there\' s severe weather or unsafe conditions. Bring
                rain gear if rain is forecasted. We\' ll keep you informed of any changes.
              </p>
            </details>

            <details className="bg-gray-50 p-6 rounded-lg cursor-pointer hover:bg-gray-100 transition">
              <summary className="font-bold text-lg text-seattle-green">
                Can I organize a private group event?
              </summary>
              <p className="text-gray-700 mt-4">
                Yes! We can help organize custom cleanup events for corporate groups, scout troops,
                schools, and other organizations. Contact us to discuss your needs.
              </p>
            </details>

            <details className="bg-gray-50 p-6 rounded-lg cursor-pointer hover:bg-gray-100 transition">
              <summary className="font-bold text-lg text-seattle-green">
                Is there a cost to participate?
              </summary>
              <p className="text-gray-700 mt-4">
                No! Participation is completely free. We provide all tools and supplies. If you want
                to support our mission beyond volunteering, check out our donations page.
              </p>
            </details>

            <details className="bg-gray-50 p-6 rounded-lg cursor-pointer hover:bg-gray-100 transition">
              <summary className="font-bold text-lg text-seattle-green">
                How can I become a regular volunteer?
              </summary>
              <p className="text-gray-700 mt-4">
                We\' d love to have you! Sign up for multiple events or contact us about becoming a
                team leader. Regular volunteers often get special roles and responsibilities.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-seattle-green text-white py-16 sm:py-24">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-green-100 max-w-2xl mx-auto">
            Join us at an upcoming event and be part of the movement to make Seattle cleaner and
            more beautiful!
          </p>
          <Link href="/events" className="btn-primary bg-white text-seattle-green hover:bg-gray-100">
            Find an Event
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
