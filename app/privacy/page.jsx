import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Privacy() {
  return (
    <>
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-r from-seattle-green to-green-700 text-white py-16">
        <div className="container-custom">
          <h1 className="heading-xl mb-4">Privacy Policy</h1>
          <p className="text-lg text-green-100">
            Last updated: July 2024
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 sm:py-24">
        <div className="container-custom max-w-3xl">
          <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">1. Introduction</h2>
            <p>
              Pick It Up Seattle ("Company", "we", "our", or "us") operates the Pick It Up Seattle
              website and services. This page informs you of our policies regarding the collection,
              use, and disclosure of personal data when you use our Service and the choices you
              have associated with that data.
            </p>

            <h2 className="text-2xl font-bold text-gray-900">2. Information Collection</h2>
            <p>
              We collect information that you provide directly to us, such as when you sign up for
              an event, make a donation, or contact us. This may include your name, email address,
              phone number, and other information you choose to provide.
            </p>

            <h2 className="text-2xl font-bold text-gray-900">3. Use of Data</h2>
            <p>Pick It Up Seattle uses the collected data for various purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide and maintain our Service</li>
              <li>To notify you about changes to our Service</li>
              <li>To allow you to participate in interactive features</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information so we can improve our Service</li>
              <li>To monitor the usage of our Service</li>
              <li>To detect, prevent and address technical issues</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900">4. Security</h2>
            <p>
              The security of your data is important to us but remember that no method of
              transmission over the Internet or method of electronic storage is 100% secure. While
              we strive to use commercially acceptable means to protect your personal data, we
              cannot guarantee its absolute security.
            </p>

            <h2 className="text-2xl font-bold text-gray-900">5. Changes to This Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes
              by posting the new Privacy Policy on this page and updating the "Last updated" date
              at the top of this Privacy Policy.
            </p>

            <h2 className="text-2xl font-bold text-gray-900">6. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
              <br />
              Email: privacy@pickitupseattle.org
              <br />
              Address: 123 Green Street, Seattle, WA 98101
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
