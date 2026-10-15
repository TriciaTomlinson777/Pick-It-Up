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
            Last updated: October 15, 2026
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
              or software) on Pick It Up Seattle’s website for personal, non-commercial
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

            <p>
              Materials explicitly offered for download and printing may be used for personal,
              family, classroom, and nonprofit educational activities, subject to any instructions
              supplied with those materials. This permission does not authorize selling the
              materials or claiming them as your own work.
            </p>

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

            <p>
              Events linked from this site may be run by independent community organizations.
              Confirm registration, schedules, safety requirements, and any event-specific terms
              directly with the organizer. Listing an event does not mean Pick It Up Seattle
              organizes or supervises it. Parents and guardians should supervise children during
              cleanup activities.
            </p>

            <h2 className="text-2xl font-bold text-gray-900">4. Assumption of Risk</h2>
            <p>
              Volunteering with Pick It Up Seattle involves physical activity outdoors. By
              volunteering, you acknowledge that you are physically capable of participating and
              assume all risks associated with participating in cleanup events, including the risk
              of physical injury.
            </p>

            <h2 className="text-2xl font-bold text-gray-900">5. Liability Disclaimer</h2>
            <p>
              The materials on Pick It Up Seattle’s website are provided on an "as is" basis. Pick
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
              Pick It Up Seattle’s website.
            </p>

            <h2 className="text-2xl font-bold text-gray-900">7. Accuracy of Materials</h2>
            <p>
              The materials appearing on Pick It Up Seattle’s website could include technical,
              typographical, or photographic errors. Pick It Up Seattle does not warrant that any
              of the materials on its website are accurate, complete, or current. Pick It Up Seattle
              may make changes to the materials contained on its website at any time without notice.
            </p>

            <h2 className="text-2xl font-bold text-gray-900">8. Links</h2>
            <p>
              Pick It Up Seattle has not reviewed all of the sites linked to its website and is not
              responsible for the contents of any such linked site. The inclusion of any link does
              not imply endorsement by Pick It Up Seattle of the site. Use of any such linked
              website is at the user’s own risk.
            </p>

            <p>
              Our <a href="/privacy">Privacy Policy</a> explains how we handle submitted
              information, photos, public contributions, and privacy requests. Submit only content
              you have permission to share, follow the photo guidelines shown on our forms, and
              avoid including identifying information about children in public submissions.
              Submissions are reviewed and are not guaranteed to be published.
            </p>

            <h2 id="submissions" className="text-2xl font-bold text-gray-900">9. Permission to display your submissions</h2>
            <p>
              You keep any copyright or other ownership rights you hold in your photos, stories,
              captions, and other submitted content. You must own the content or have authority
              from its owner to grant the permissions described here, and obtain any permissions
              needed from people shown in it.
            </p>
            <p>
              When you submit content after being shown this permission notice, you give
              Pick It Up Seattle a nonexclusive, royalty-free permission to receive, store,
              reproduce, and display approved content on its website in connection with its
              community mission. Nonexclusive means you can continue using and sharing your
              content elsewhere. Royalty-free means we do not pay a fee for this permitted use.
              Our service providers may process content as needed to operate these website features.
            </p>
            <p>
              This permission includes resizing, compression, cropping for layout, removal of
              embedded metadata, and face blurring for privacy and display. It does not transfer
              ownership to us or grant permission to sell your content, put it on merchandise,
              or use it in separate advertising or social media campaigns; those uses require
              separate permission. Our privacy and child-photo safeguards still apply.
            </p>
            <p>
              Submission does not guarantee publication. You may ask us to remove your content
              from public display by contacting hello@pickitupseattle.org. We may need to verify
              your authority to make the request. Retained records and backups are handled as
              described in our Privacy Policy, and we cannot remove copies already saved or shared
              by others. This notice does not create new permission for older submissions whose
              contributors were not shown it.
            </p>

            <h2 className="text-2xl font-bold text-gray-900">10. Modifications</h2>
            <p>
              Pick It Up Seattle may revise these terms of service for its website at any time
              without notice. By using this website, you are agreeing to be bound by the then
              current version of these terms of service.
            </p>

            <h2 className="text-2xl font-bold text-gray-900">11. Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws
              of the State of Washington, and you irrevocably submit to the exclusive jurisdiction
              of the courts in that location.
            </p>

            <h2 className="text-2xl font-bold text-gray-900">12. Contact Us</h2>
            <p>
              If you have questions about these Terms of Service, please contact us at:
              <br />
              Email: <a href="mailto:hello@pickitupseattle.org">hello@pickitupseattle.org</a>
              <br />
              Location: Seattle, Washington
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
