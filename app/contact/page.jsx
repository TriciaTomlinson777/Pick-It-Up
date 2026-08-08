"use client";

import { useEffect, useRef, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SITE_CONTACT_EMAIL, SITE_CONTACT_MAILTO } from '@/lib/site-contact';
import { buildSubmissionFields, submitContactStyleForm } from '@/lib/contact-form-submission';

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [formResetKey, setFormResetKey] = useState(0);
  const confirmationRef = useRef(null);

  useEffect(() => {
    if (!successMessage) {
      return;
    }

    confirmationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [successMessage]);

  useEffect(() => {
    if (!successMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setSuccessMessage('');
      setFormResetKey((value) => value + 1);
    }, 4000);

    return () => window.clearTimeout(timeoutId);
  }, [successMessage]);

  async function handleSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const formData = new FormData(form);
      const email = String(formData.get('email') || '').trim();
      const inquirySubject = String(formData.get('subject') || '').trim() || 'General Inquiry';

      await submitContactStyleForm({
        formType: 'Contact Form',
        subject: `Contact Form: ${inquirySubject}`,
        replyTo: email,
        sourcePath: '/contact',
        fields: buildSubmissionFields(formData, [
          { name: 'firstName', label: 'First Name' },
          { name: 'lastName', label: 'Last Name' },
          { name: 'email', label: 'Email' },
          { name: 'subject', label: 'Subject' },
          { name: 'message', label: 'Message' },
        ]),
      });

      setSuccessMessage('Thank you for reaching out! We\'ve received your message and will be in touch soon.');
    } catch (error) {
      setErrorMessage(error.message || 'Unable to send message.');
    } finally {
      setIsSubmitting(false);
    }
  }

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
              {successMessage ? (
                <div ref={confirmationRef} className="rounded-xl border border-[#1f8f3c]/20 bg-[#ecf9f0] px-6 py-10 text-center">
                  <p className="text-2xl font-bold text-[#1f8f3c]">Thank you for reaching out!</p>
                  <p className="mt-3 text-base font-semibold text-[#1f8f3c]">We’ve received your message and will be in touch soon.</p>
                </div>
              ) : (
                <form key={formResetKey} className="space-y-6" onSubmit={handleSubmit}>
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

                  {errorMessage ? (
                    <p className="rounded-xl border border-[#b23d31]/20 bg-[#fff2f0] px-4 py-2.5 text-sm font-semibold text-[#b23d31]">
                      {errorMessage}
                    </p>
                  ) : null}

                  <button type="submit" disabled={isSubmitting} className="btn-primary w-full disabled:opacity-70">
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>

                  <p className="text-center text-sm text-gray-600">
                    Every great community starts with a conversation.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
