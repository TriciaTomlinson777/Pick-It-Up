import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Terms() {
  return (
    <>
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-r from-seattle-green to-green-700 text-white py-16">
        <div className="container-custom">
          <h1 className="heading-xl mb-4">Terms of Service</h1>
          <p className="text-lg text-green-100">
            Last updated: July 2024
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 sm:py-24">
        <div className="container-custom max-w-3xl">
          <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">1. Agreement to Terms</h2>
            <p>
              By accessing and using the Pick It Up Seattle website and services, you accept and
              agree to be bound by and comply with these Terms and Conditions. If you do not agree
              to abide by the above, please do not use this service.
            </p>

            <h2 className="text-2xl font-bold text-gray-900">2. Use License</h2>
            <p>
              Permission is granted to temporarily download one copy of the materials (information
              or software) on Pick It Up Seattle\' s website for personal, non-commercial
              transitory viewing only. This is the grant of a license, not a transfer of title, and
              under this license you may not:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Modifying or copying the materials</li>
              <li>Using the materials for any commercial purpose or for any public display</li>
              <li>
                Attempting to decompile, reverse engineer, disassemble, or otherwise discovering
                any source code
              </li>
              <li>Removing any copyright or other proprietary notations from the materials</li>
              <li>
                Transferring the materials to another person or "mirroring" the materials on any
                other server
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900">3. Volunteer Code of Conduct</h2>
            <p>All volunteers agree to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Follow all safety guidelines and instructions from event leaders</li>
              <li>Treat all other volunteers and community members with respect</li>
              <li>Work as a team toward our mission</li>
              <li>Use equipment and supplies responsibly</li>
              <li>Report any safety concerns immediately</li>
              <li>Have fun and maintain a positive attitude</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900">4. Assumption of Risk</h2>
            <p>
              Volunteering with Pick It Up Seattle involves physical activity outdoors. By
              volunteering, you acknowledge that you are physically capable of participating and
              assume all risks associated with participating in cleanup events, including the risk
              of physical injury.
            </p>

            <h2 className="text-2xl font-bold text-gray-900">5. Liability Disclaimer</h2>
            <p>
              The materials on Pick It Up Seattle\' s website are provided on an "as is" basis. Pick
              It Up Seattle makes no warranties, expressed or implied, and hereby disclaims and
              negates all other warranties including, without limitation, implied warranties or
              conditions of merchantability, fitness for a particular purpose, or non-infringement
              of intellectual property or other violation of rights.
            </p>

            <h2 className="text-2xl font-bold text-gray-900">6. Limitations</h2>
            <p>
              In no event shall Pick It Up Seattle or its suppliers be liable for any damages
              (including, without limitation, damages for loss of data or profit, or due to
              business interruption) arising out of the use or inability to use the materials on
              Pick It Up Seattle\' s website.
            </p>

            <h2 className="text-2xl font-bold text-gray-900">7. Accuracy of Materials</h2>
            <p>
              The materials appearing on Pick It Up Seattle\' s website could include technical,
              typographical, or photographic errors. Pick It Up Seattle does not warrant that any
              of the materials on its website are accurate, complete, or current. Pick It Up Seattle
              may make changes to the materials contained on its website at any time without notice.
            </p>

            <h2 className="text-2xl font-bold text-gray-900">8. Links</h2>
            <p>
              Pick It Up Seattle has not reviewed all of the sites linked to its website and is not
              responsible for the contents of any such linked site. The inclusion of any link does
              not imply endorsement by Pick It Up Seattle of the site. Use of any such linked
              website is at the user\' s own risk.
            </p>

            <h2 className="text-2xl font-bold text-gray-900">9. Modifications</h2>
            <p>
              Pick It Up Seattle may revise these terms of service for its website at any time
              without notice. By using this website, you are agreeing to be bound by the then
              current version of these terms of service.
            </p>

            <h2 className="text-2xl font-bold text-gray-900">10. Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws
              of the State of Washington, and you irrevocably submit to the exclusive jurisdiction
              of the courts in that location.
            </p>

            <h2 className="text-2xl font-bold text-gray-900">11. Contact Us</h2>
            <p>
              If you have questions about these Terms of Service, please contact us at:
              <br />
              Email: legal@pickitupseattle.org
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
