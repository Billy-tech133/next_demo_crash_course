'use client';

import { useState } from 'react';

const BookEvent = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        setSubmitted(true);
      } else {
        setError('Failed to submit booking.');
      }
    } catch (err) {
      setError('An error occurred while submitting the booking.');
    }
  };

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
