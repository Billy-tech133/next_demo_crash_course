import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Event from '@/database/event.model';

interface Params {
  slug: string;
}

interface ErrorResponse {
  message: string;
  detail?: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<Params> }
): Promise<NextResponse> {
  // Validate input
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  if (!slug || typeof slug !== 'string' || slug.trim() === '') {
    const errorResponse: ErrorResponse = {
      message: 'Missing or invalid slug parameter',
      detail: 'slug must be a non-empty string',
    };
    return NextResponse.json(errorResponse, { status: 400 });
  }

  const normalizedSlug = slug.trim();

  try {
    await connectToDatabase();

    const eventDocument = await Event.findOne({ slug: normalizedSlug })
      .lean()
      .exec();

    if (!eventDocument) {
      const errorResponse: ErrorResponse = {
        message: 'Event not found',
        detail: `No event found for slug: ${normalizedSlug}`,
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    return NextResponse.json(eventDocument, { status: 200 });
  } catch (error) {
    console.error('GET /api/events/[slug] error:', error);

    const errorResponse: ErrorResponse = {
      message: 'Unexpected server error',
      detail: error instanceof Error ? error.message : String(error),
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
