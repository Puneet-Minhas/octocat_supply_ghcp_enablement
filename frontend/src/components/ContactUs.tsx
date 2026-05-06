import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.name.trim()) {
    errors.name = 'Name is required.';
  } else if (data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  }

  if (!data.email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!EMAIL_REGEX.test(data.email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!data.subject.trim()) {
    errors.subject = 'Subject is required.';
  } else if (data.subject.trim().length < 3) {
    errors.subject = 'Subject must be at least 3 characters.';
  }

  if (!data.message.trim()) {
    errors.message = 'Message is required.';
  } else if (data.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters.';
  }

  return errors;
}

export default function ContactUs() {
  const { darkMode } = useTheme();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear the error for the field being edited
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitted(true);
  };

  const handleReset = () => {
    setFormData({ name: '', email: '', subject: '', message: '' });
    setErrors({});
    setSubmitted(false);
  };

  const inputClass = `w-full px-3 py-2 rounded transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary ${
    darkMode ? 'bg-gray-700 text-light' : 'bg-gray-100 text-gray-800'
  }`;

  const labelClass = `block mb-1 font-medium transition-colors duration-300 ${
    darkMode ? 'text-light' : 'text-gray-700'
  }`;

  const errorClass = 'mt-1 text-sm text-red-500';

  return (
    <div
      className={`min-h-screen pt-20 ${darkMode ? 'bg-dark' : 'bg-gray-100'} flex items-center justify-center px-4 transition-colors duration-300`}
    >
      <div
        className={`max-w-lg w-full ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-8 transition-colors duration-300`}
      >
        <h1
          className={`text-3xl font-bold mb-2 transition-colors duration-300 ${darkMode ? 'text-light' : 'text-gray-800'}`}
        >
          Contact Us
        </h1>
        <p className={`mb-6 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Have a question or feedback? We'd love to hear from you.
        </p>

        {submitted ? (
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mx-auto">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2
              className={`text-xl font-semibold ${darkMode ? 'text-light' : 'text-gray-800'}`}
            >
              Message Sent!
            </h2>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Thank you, <strong>{formData.name}</strong>! We'll get back to you at{' '}
              <strong>{formData.email}</strong> as soon as possible.
            </p>
            <button
              onClick={handleReset}
              className="mt-4 bg-primary hover:bg-accent text-white py-2 px-6 rounded transition-colors"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Name */}
            <div>
              <label htmlFor="name" className={labelClass}>
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className={inputClass}
                aria-describedby={errors.name ? 'name-error' : undefined}
                aria-invalid={!!errors.name}
                autoFocus
              />
              {errors.name && (
                <p id="name-error" className={errorClass} role="alert">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className={labelClass}>
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={inputClass}
                aria-describedby={errors.email ? 'email-error' : undefined}
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p id="email-error" className={errorClass} role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="subject" className={labelClass}>
                Subject
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                value={formData.subject}
                onChange={handleChange}
                className={inputClass}
                aria-describedby={errors.subject ? 'subject-error' : undefined}
                aria-invalid={!!errors.subject}
              />
              {errors.subject && (
                <p id="subject-error" className={errorClass} role="alert">
                  {errors.subject}
                </p>
              )}
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className={labelClass}>
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                className={inputClass}
                aria-describedby={errors.message ? 'message-error' : undefined}
                aria-invalid={!!errors.message}
              />
              {errors.message && (
                <p id="message-error" className={errorClass} role="alert">
                  {errors.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-accent text-white py-2 px-4 rounded transition-colors"
            >
              Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
