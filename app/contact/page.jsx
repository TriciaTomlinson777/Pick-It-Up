import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SITE_CONTACT_EMAIL, SITE_CONTACT_MAILTO } from '@/lib/site-contact';

export default function Contact() {
  return (
    <>
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-r from-seattle-green to-green-700 text-white py-16">
        <div className="container-custom">
          <h1 className="heading-xl mb-4 font-bold text-[#0f9aa1]">We’d Love to Hear From You</h1>
          <p className="text-[1.18rem] font-semibold leading-relaxed text-[#002244]">
            Whether you have a question, an idea, would like to organize a cleanup, become a community partner, or simply want to say hello, we’d love to hear from you.
          </p>
          <p className="mt-4 text-[1.18rem] font-semibold text-[#002244]">
            We’ll get back to you as soon as we can.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 sm:py-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start">
            {/* Contact Info */}
            <div className="lg:col-span-1">
              <h2 className="mb-8 text-2xl font-bold text-[#0f9aa1]">Contact Info</h2>

              <div className="space-y-8">
                <div>
                  <h3 className="font-bold text-seattle-green mb-2">📧 Email</h3>
                  <a
                    href={SITE_CONTACT_MAILTO}
                    className="text-gray-600 hover:text-seattle-green"
                  >
                    {SITE_CONTACT_EMAIL}
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-1">
              <h2 className="mb-8 text-2xl font-bold text-[#ef7f2d]">Send us a Message</h2>
              <form className="space-y-6" action={SITE_CONTACT_MAILTO} method="post" encType="text/plain">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
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
                      name="lastName"
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
                    name="email"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-seattle-green"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <select
                    name="subject"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-seattle-green"
                  >
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
                    name="message"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-seattle-green"
                  ></textarea>
                </div>

                <button type="submit" className="btn-primary w-full">
                  Send Message
                </button>

                <p className="text-center text-sm text-gray-600">
                  Every great community starts with a conversation.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
