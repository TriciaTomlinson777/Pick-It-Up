import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Contact() {
  return (
    <>
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-r from-seattle-green to-green-700 text-white py-16">
        <div className="container-custom">
          <h1 className="heading-xl mb-4">Get In Touch</h1>
          <p className="text-lg text-green-100">
            Have questions? Want to partner with us? We\' d love to hear from you!
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 sm:py-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
            {/* Contact Info */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-bold mb-8">Contact Info</h2>

              <div className="space-y-8">
                <div>
                  <h3 className="font-bold text-seattle-green mb-2">📧 Email</h3>
                  <a
                    href="mailto:hello@pickitupseattle.org"
                    className="text-gray-600 hover:text-seattle-green"
                  >
                    hello@pickitupseattle.org
                  </a>
                </div>

                <div>
                  <h3 className="font-bold text-seattle-green mb-2">📱 Phone</h3>
                  <a
                    href="tel:+12065551234"
                    className="text-gray-600 hover:text-seattle-green"
                  >
                    (206) 555-1234
                  </a>
                </div>

                <div>
                  <h3 className="font-bold text-seattle-green mb-2">📍 Office</h3>
                  <address className="text-gray-600 not-italic">
                    123 Green Street<br />
                    Seattle, WA 98101
                  </address>
                </div>

                <div>
                  <h3 className="font-bold text-seattle-green mb-2">🕐 Hours</h3>
                  <p className="text-gray-600">
                    Monday - Friday: 9am - 5pm PT<br />
                    Saturday: 10am - 3pm PT<br />
                    Sunday: Closed
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-seattle-green mb-3">Follow Us</h3>
                  <div className="flex space-x-4">
                    <a href="https://twitter.com" className="hover:text-seattle-green">
                      Twitter
                    </a>
                    <a href="https://facebook.com" className="hover:text-seattle-green">
                      Facebook
                    </a>
                    <a href="https://instagram.com" className="hover:text-seattle-green">
                      Instagram
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-8">Send us a Message</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-seattle-green"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-seattle-green"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-seattle-green"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-seattle-green">
                    <option>General Inquiry</option>
                    <option>Event Partnership</option>
                    <option>Corporate Group</option>
                    <option>Feedback</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    rows="6"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-seattle-green"
                  ></textarea>
                </div>

                <button type="submit" className="btn-primary w-full">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
