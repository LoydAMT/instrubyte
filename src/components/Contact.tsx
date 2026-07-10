import React, { useRef, useState } from 'react';
import { useReveal } from '../useReveal';
import { services } from '../data/services';
import type { FormState, SubmitStatus } from '../types';

const CONTACT_ENDPOINT = 'https://api.web3forms.com/submit';
const WEB3FORMS_ACCESS_KEY = 'cb97064f-30a7-4e9b-b4e4-6b038e7b0231';
const MIN_FILL_TIME_MS = 3000;
const SUBMIT_COOLDOWN_MS = 60000;
const RATE_LIMIT_STORAGE_KEY = 'instrubyte_last_submit';

const serviceOptions = ['General Inquiry', 'Request a Quotation', ...services.map((s) => s.title)];

const Contact: React.FC = () => {
  const contactReveal = useReveal<HTMLElement>();

  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    company: '',
    service: serviceOptions[1],
    message: '',
  });
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('Something went wrong. Please try again in a moment.');
  const formLoadedAt = useRef(Date.now());

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fields = e.currentTarget.elements;
    const honeypot = (fields.namedItem('_honey') as HTMLInputElement | null)?.value;
    const botcheck = (fields.namedItem('botcheck') as HTMLInputElement | null)?.checked;

    // Bot traps: pretend success without actually submitting, so bots don't learn to adapt.
    if (honeypot || botcheck) {
      setStatus('success');
      setFormData({ name: '', email: '', company: '', service: serviceOptions[1], message: '' });
      return;
    }

    if (Date.now() - formLoadedAt.current < MIN_FILL_TIME_MS) {
      setStatus('success');
      setFormData({ name: '', email: '', company: '', service: serviceOptions[1], message: '' });
      return;
    }

    // Real rate limit: block rapid repeat submissions from the same browser.
    const lastSubmit = Number(localStorage.getItem(RATE_LIMIT_STORAGE_KEY) || 0);
    const msSinceLastSubmit = Date.now() - lastSubmit;
    if (msSinceLastSubmit < SUBMIT_COOLDOWN_MS) {
      const waitSeconds = Math.ceil((SUBMIT_COOLDOWN_MS - msSinceLastSubmit) / 1000);
      setErrorMessage(`Please wait ${waitSeconds}s before sending another request.`);
      setStatus('error');
      return;
    }

    setStatus('submitting');

    try {
      const body = new FormData();
      body.append('access_key', WEB3FORMS_ACCESS_KEY);
      body.append('subject', `New website inquiry from ${formData.name}`);
      body.append('from_name', 'InstruByte Website');
      body.append('replyto', formData.email);
      body.append('name', formData.name);
      body.append('email', formData.email);
      body.append('company', formData.company || 'Not provided');
      body.append('service_needed', formData.service);
      body.append('message', formData.message);

      const response = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body,
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      localStorage.setItem(RATE_LIMIT_STORAGE_KEY, Date.now().toString());
      setStatus('success');
      setFormData({ name: '', email: '', company: '', service: serviceOptions[1], message: '' });
    } catch {
      setErrorMessage('Something went wrong. Please try again in a moment.');
      setStatus('error');
    }
  };

  return (
    <section
      id="contact"
      ref={contactReveal.ref}
      className={`contact-section panel-reveal${contactReveal.visible ? ' is-visible' : ''}`}
    >
      <h2 className="section-title">Request a Quotation</h2>
      <p className="contact-text">
        Have a project in mind or need expert advice? Fill out the form below and our team will get back to you shortly.
      </p>

      <form className="contact-form" onSubmit={handleSubmit}>
        <input type="text" name="_honey" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
        <input type="checkbox" name="botcheck" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Juan Dela Cruz"
            />
          </div>
          <div className="form-field">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="you@company.com"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="company">Company / Organization</label>
            <input
              id="company"
              name="company"
              type="text"
              value={formData.company}
              onChange={handleChange}
              placeholder="Optional"
            />
          </div>
          <div className="form-field">
            <label htmlFor="service">Service Needed</label>
            <select id="service" name="service" value={formData.service} onChange={handleChange}>
              {serviceOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="message">Project Details</label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell us about your project or request a quotation..."
          />
        </div>

        <button type="submit" className="primary-button form-submit" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'SENDING...' : 'SEND REQUEST'}
        </button>

        {status === 'success' && (
          <p className="form-status form-status-success" role="status">
            Thank you! Your request has been sent. We&apos;ll get back to you soon.
          </p>
        )}
        {status === 'error' && (
          <p className="form-status form-status-error" role="alert">
            {errorMessage}
          </p>
        )}
      </form>
    </section>
  );
};

export default Contact;
