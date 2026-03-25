import mongoose, { Document, Schema } from 'mongoose';
import Event from './event.model';

export interface IBooking {
  eventId: mongoose.Types.ObjectId;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BookingDocument extends IBooking, Document {}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const bookingSchema = new Schema<BookingDocument>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (value: string) => emailRegex.test(value),
        message: 'Email must be valid.',
      },
    },
  },
  {
    timestamps: true,
    strict: true,
  }
);

// Ensure the event exists before saving a booking.
bookingSchema.pre<BookingDocument>('save', async function () {
  const eventExists = await Event.exists({ _id: this.eventId });
  if (!eventExists) {
    throw new Error('Referenced Event does not exist.');
  }
});

const Booking =
  mongoose.models.Booking ||
  mongoose.model<BookingDocument>('Booking', bookingSchema);
export default Booking;
