import Header from '@/components/Header';
import Footer from '@/components/Footer';

const PRIVACY_SECTIONS = [
  [
    "1. About this policy",
    [
      "Pick It Up Seattle is a nonprofit community initiative based in Seattle, Washington. This policy explains how we handle information when you use our website, share a cleanup, submit a photo or story, contact us, or use features we make available. Street Challenge is currently in development; this policy will be updated as its data practices change."
    ]
  ],
  [
    "2. Information we receive",
    [
      "We receive information you choose to submit, such as your name, email address, phone number, messages, event details, stories, captions, photos, and cleanup information. A cleanup submission may include a neighborhood, nearby intersection, or map location you choose to provide. Some features also save information in your browser.",
      "When account or game features are available and you use them, information may include a sign-in email, player name, avatar, saved progress, points, and submissions. Our hosting and other service providers may also process technical information, such as IP addresses, browser information, and request logs, to deliver and protect the service."
    ]
  ],
  [
    "3. How we use information",
    [
      "We use information to operate the website and available game features, respond to requests, review submissions, show community contributions, save progress, maintain security, prevent misuse, and understand and improve the experience. We do not sell personal information. Our use of information supports our community mission and the operation, safety, and improvement of the website and game."
    ]
  ],
  [
    "4. What may be public",
    [
      "Photos, stories, thank-you notes, cleanup locations, captions, and event details submitted for publication may appear on public pages after approval. A submission name or attribution may also be shown. Event contact information is published only when permission to display it has been provided. Contact information supplied privately for follow-up is not intended for public display.",
      "Please do not include a child's full name, home address, school, contact details, or other identifying information in a public submission. Approved public content may be copied, downloaded, or shared by other people; removing it from our site cannot remove copies others have already made."
    ]
  ],
  [
    "5. Photo privacy: faces and embedded information",
    [
      "For new community photo uploads submitted through our photo forms, we process images to remove embedded location and camera information, often called EXIF metadata. This includes GPS information embedded in the image file. We also use automated face detection and blur faces identified as children's faces in the processed images. Photos may be resized or compressed.",
      "If an automated privacy check cannot be completed, the submission is held for review rather than automatically approved. Automated face and age detection can make mistakes or miss a face. Blurring and removing metadata do not remove identifying information visible in the picture itself, or a location or caption entered separately. Please review photos carefully before submitting them and contact us if you notice a privacy concern.",
      "These processing steps apply to new uploads handled by our community photo system; they are not a guarantee that every older image, linked image, or third-party image has been processed."
    ]
  ],
  [
    "6. Children and families",
    [
      "Children's privacy matters to us. Parents and legal guardians should supervise children's participation and handle submissions involving their children. If a photo intentionally features a child, our submission forms ask the submitter to confirm that they are the child's parent or legal guardian. Permission to submit a photo does not replace the need for appropriate privacy protections.",
      "A parent or guardian can contact us to ask about information concerning their child, request correction or removal, or raise a concern about a photo. We may ask for enough information to verify the request and protect the child. Before opening new game features to children, we will review the information those features collect, parental controls and permissions, public visibility, and retention practices."
    ]
  ],
  [
    "7. Service providers and external websites",
    [
      "We use service providers to host the website, store information, deliver communications, and help review content for safety. These include Vercel for hosting, Supabase for storage and data services, and Amazon Web Services for automated image and text checks. Relevant submitted content may be processed by these providers to perform those functions.",
      "Our site links to independent event organizers, Fourthwall shopping pages, and other external services, and may embed third-party content such as YouTube videos. Those services have their own privacy practices and may collect information when you visit or use them. Information may also be disclosed when necessary to comply with applicable law or protect people and the service."
    ]
  ],
  [
    "8. Cookies and browser storage",
    [
      "We use cookies or browser storage where needed for functions such as administrator sign-in and remembering information used by website features. External services and embedded content may use their own cookies or similar technologies. You can manage cookies and site data in your browser; clearing or blocking them may affect saved information or how features work."
    ]
  ],
  [
    "9. Retention, removal, and your choices",
    [
      "We keep information as needed to provide the relevant service, maintain published contributions, respond to requests, protect the service, and meet applicable obligations. There is not currently one automatic deletion period covering all submissions. For example, expired events are hidden from the public site but retained in Admin records.",
      "You can choose not to submit optional information and can contact us to request access, correction, or deletion of information you provided. Parents and guardians can make requests concerning their children. Some information may need to be retained for legal or security reasons, and backup copies may remain until replaced through normal backup processes."
    ]
  ],
  [
    "10. Security and policy updates",
    [
      "We use safeguards designed to protect information, including restricted administrative access and review of submitted content. No website or storage system can guarantee complete security. Please contact us promptly about a suspected privacy or security problem.",
      "When we change this policy, we will publish the revised policy here and update its date. We will provide additional notice or seek permission when required for a change in how information is used."
    ]
  ]
];

export default function Privacy() {
  return (
    <>
      <Header />
      <main>
        <section className="hero-surface py-16 sm:py-20">
          <div className="container-custom">
            <h1 className="heading-xl mb-4">Privacy Policy</h1>
            <p className="text-lg text-[#1f5f7a]">Last updated: October 15, 2026</p>
          </div>
        </section>
        <section className="py-16 sm:py-20">
          <div className="container-custom max-w-3xl">
            <div className="space-y-8 text-[#516b7d]">
              {PRIVACY_SECTIONS.map(([title, paragraphs]) => (
                <section key={title}>
                  <h2 className="mb-3 text-2xl font-bold text-[#002244]">{title}</h2>
                  <div className="space-y-4 leading-7">
                    {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  </div>
                </section>
              ))}
              <section>
                <h2 className="mb-3 text-2xl font-bold text-[#002244]">11. Contact us</h2>
                <p className="leading-7">For privacy questions or requests, contact Pick It Up Seattle.</p>
                <p className="mt-3 leading-7">
                  Email: <a className="text-[#0b6e85] underline" href="mailto:hello@pickitupseattle.org">hello@pickitupseattle.org</a><br />
                  Location: Seattle, Washington
                </p>
              </section>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
