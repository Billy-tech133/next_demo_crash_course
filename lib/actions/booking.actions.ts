'use server';

import Booking from '@/database/booking.model';
import { connectToDatabase } from '../mongodb';

export const createBooking = async (bookingData: {
  eventId: string;
  slug: string;
  email: string;
}) => {
  try {
    await connectToDatabase();
    const { eventId, slug, email } = bookingData;
    const booking = await Booking.create(bookingData);

    // Convert Mongoose document to plain object to avoid Next.js serialization issues
    const plainBooking = {
      _id: booking._id.toString(),
      eventId: booking.eventId.toString(),
      email: booking.email,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    };

    return { success: true, booking: plainBooking };
  } catch (e) {
    console.error('Error creating booking:', e);
    return { success: false, e: e };
  }
};
