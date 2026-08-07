"use client";

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { submitContactStyleForm, buildSubmissionFields } from '@/lib/contact-form-submission';

export default function Partners() {
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [selectedOrganizationType, setSelectedOrganizationType] = useState('');
  const [isSubmittingPartnerForm, setIsSubmittingPartnerForm] = useState(false);
  const [partnerFormErrorMessage, setPartnerFormErrorMessage] = useState('');
  const [partnerConfirmationMessage, setPartnerConfirmationMessage] = useState('');

  const partnerTypes = [
    {
      label: 'Business',
      icon: '🏢',
      className: 'bg-[#0f9aa1] text-white border-[#0a8388] hover:bg-[#0a8388]',
    },
    {
      label: 'School',
      icon: '🏫',
      className: 'bg-[#61b826] text-[#002244] border-[#53a41e] hover:bg-[#53a41e]',
    },
    {
      label: 'Nonprofit',
      icon: '💛',
      className: 'bg-[#f4c94c] text-[#002244] border-[#e7ba36] hover:bg-[#e7ba36]',
    },
    {
      label: 'Community Event',
      icon: '🎉',
      className: 'bg-[#f59a2d] text-white border-[#ea8718] hover:bg-[#ea8718]',
    },
    {
      label: 'Government Agency',
      icon: '🏛️',
      className: 'bg-[#1fb8c2] text-white border-[#0fa5af] hover:bg-[#0fa5af]',
    },
    {
      label: 'Community Organization',
      icon: '🤝',
      className: 'bg-[#69be28] text-[#002244] border-[#53a41e] hover:bg-[#53a41e]',
    },
    {
      label: 'Other',
      icon: '✨',
      className: 'bg-[#ef7f2d] text-white border-[#df6f1e] hover:bg-[#df6f1e]',
    },
  ];

  const autoResizeTextarea = (event) => {
    const target = event.target;
    target.style.height = 'auto';
    target.style.height = `${target.scrollHeight}px`;
  };

  const openPartnerModal = (organizationType) => {
    setSelectedOrganizationType(organizationType);
    setIsPartnerModalOpen(true);
  };

  const closePartnerModal = () => {
    setIsPartnerModalOpen(false);
    setSelectedOrganizationType('');
    setPartnerFormErrorMessage('');
  };

  async function handlePartnerSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    setIsSubmittingPartnerForm(true);
    setPartnerFormErrorMessage('');
    setPartnerConfirmationMessage('');

    try {
      const formData = new FormData(form);
      const email = String(formData.get('email') || '').trim();
      const organizationType = String(formData.get('organizationType') || '').trim() || 'Partner Inquiry';

      await submitContactStyleForm({
        formType: 'Partners Form',
        subject: `Partners Form: ${organizationType}`,
        replyTo: email,
        sourcePath: '/partners',
        fields: buildSubmissionFields(formData, [
          { name: 'organizationName', label: 'Organization Name' },
          { name: 'contactName', label: 'Contact Name' },
          { name: 'email', label: 'Email' },
          { name: 'phone', label: 'Phone Number' },
          { name: 'organizationType', label: 'Organization Type' },
          { name: 'partnershipDetails', label: 'Partnership Details' },
        ]),
      });

      form.reset();
      closePartnerModal();
      setPartnerConfirmationMessage('Thank you for reaching out! We\'ve received your partnership inquiry and will be in touch soon.');
    } catch (error) {
      setPartnerFormErrorMessage(error.message || 'Unable to send partnership inquiry.');
    } finally {
      setIsSubmittingPartnerForm(false);
    }
  }

  return (
    <>
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-r from-seattle-green to-green-700 text-white py-16">
        <div className="container-custom">
          <h1 className="heading-xl mb-4">Become a Community Partner</h1>
          <p className="text-lg text-[#002244] max-w-4xl">
            Whether you are a business, school, nonprofit, neighborhood group, event organizer, or
            community leader, there are many ways to help create a cleaner Seattle.
          </p>
        </div>
      </section>

      {/* Partnership Opportunities */}
      <section className="py-16 sm:py-24">
        <div className="container-custom">
          {partnerConfirmationMessage ? (
            <p className="mb-6 rounded-xl border border-[#1f8f3c]/20 bg-[#ecf9f0] px-4 py-3 text-sm font-semibold text-[#1f8f3c]">
              {partnerConfirmationMessage}
            </p>
          ) : null}

          <div className="rounded-2xl bg-white p-6 shadow-md sm:p-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {partnerTypes.map((partnerType) => (
                <button
                  key={partnerType.label}
                  type="button"
                  onClick={() => openPartnerModal(partnerType.label)}
                  className={`flex min-h-[88px] w-full items-center gap-3 rounded-xl border px-5 py-4 text-left text-lg font-bold shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(0,43,73,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f9aa1] ${partnerType.className}`}
                >
                  <span className="text-2xl" aria-hidden="true">{partnerType.icon}</span>
                  <span>{partnerType.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Partner Logos Placeholder - temporarily hidden until first partner is ready */}
      {false ? (
        <section className="pb-16 sm:pb-24">
          <div className="container-custom">
            <h2 className="text-3xl font-bold mb-6">Our Community Partners</h2>
            <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 min-h-[180px] sm:min-h-[220px]" aria-label="Community partner logos placeholder" />
          </div>
        </section>
      ) : null}

      {/* Contact CTA */}
      <section className="bg-[#fff4cc] py-16 sm:py-24">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-bold mb-6 text-[#002244]">Ready to Partner?</h2>
          <Link href="/contact" className="btn-primary">
            Contact Us
          </Link>
        </div>
      </section>

      {isPartnerModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#002244]/70 p-4" role="dialog" aria-modal="true" aria-labelledby="partner-contact-modal-title">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl sm:p-8">
            <button
              type="button"
              onClick={closePartnerModal}
              className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#0f9aa1]/30 text-2xl leading-none text-[#1f5f7a] transition hover:bg-[#f2fbff]"
              aria-label="Close partner contact form"
            >
              ×
            </button>

            <h3 id="partner-contact-modal-title" className="text-2xl font-bold text-[#002244] sm:text-3xl">
              Partner With Pick It Up Seattle
            </h3>

            <form className="mt-6 space-y-6" onSubmit={handlePartnerSubmit}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-gray-700">Organization Name</span>
                  <input
                    name="organizationName"
                    type="text"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-seattle-green"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-gray-700">Contact Name</span>
                  <input
                    name="contactName"
                    type="text"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-seattle-green"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-gray-700">Email</span>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-seattle-green"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-gray-700">Phone number</span>
                  <input
                    name="phone"
                    type="tel"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-seattle-green"
                  />
                </label>

                <label className="block sm:col-span-2">
                  <span className="mb-1 block text-sm font-medium text-gray-700">Organization Type</span>
                  <input
                    name="organizationType"
                    type="text"
                    value={selectedOrganizationType}
                    readOnly
                    className="w-full rounded-lg border border-gray-300 bg-[#f6fbfd] px-4 py-2 text-[#1f5f7a] focus:outline-none focus:ring-2 focus:ring-seattle-green"
                  />
                </label>
              </div>

              <div>
                <label htmlFor="partnership-details" className="mb-2 block text-sm font-medium text-gray-700">
                  Tell us how you would like to partner with Pick It Up Seattle
                </label>
                <textarea
                  id="partnership-details"
                  name="partnershipDetails"
                  rows="7"
                  onInput={autoResizeTextarea}
                  className="min-h-[10rem] w-full resize-y overflow-hidden rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-seattle-green"
                />
              </div>

              {partnerFormErrorMessage ? (
                <p className="rounded-xl border border-[#b23d31]/20 bg-[#fff2f0] px-4 py-2.5 text-sm font-semibold text-[#b23d31]">
                  {partnerFormErrorMessage}
                </p>
              ) : null}

              <button type="submit" disabled={isSubmittingPartnerForm} className="btn-primary w-full sm:w-auto disabled:opacity-70">
                {isSubmittingPartnerForm ? 'Sending...' : 'Submit'}
              </button>
            </form>
          </div>
        </div>
      ) : null}

      <Footer />
    </>
  );
}
