'use client';

import { createBooking } from '@/lib/actions/booking.actions';
import posthog from 'posthog-js';
import { useState } from 'react';

const BookEvent = ({ eventId, slug }: { eventId: string; slug: string }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { success, e: error } = await createBooking({ eventId, slug, email });

    if (success) {
      setSubmitted(true);
      posthog.capture('event_booked', {
        eventId,
        slug,
        email,
      });
    } else {
      console.error('Booking failed:', error);
      posthog.captureException(
        error instanceof Error ? error : new Error(String(error)),
        {
          context: {
            eventId,
            slug,
            email,
          },
        }
      );
    }
  };

  setTimeout(() => {
    setSubmitted(true);
  }, 5000);

  return (
    <div id="book-event">
      {submitted ? (
        <p className="text-green-600">
          Thank you for booking! A confirmation email has been sent to {email}.
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block mb-2 font-medium">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
            />
          </div>
          <button type="submit" className="buttin-submit">
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default BookEvent;
