import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Event from '@/database/event.model';
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

// Configure Cloudinary with credentials from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const formData = await request.formData();

    let event;

    try {
      event = Object.fromEntries(formData.entries());

      // Trim all string values to prevent validation issues
      for (const [key, value] of Object.entries(event)) {
        if (typeof value === 'string') {
          event[key] = value.trim();
        }
      }
    } catch (e) {
      console.error('Error parsing form data:', e);
      return NextResponse.json(
        {
          message: 'Invalid form data',
          error: e instanceof Error ? e.message : 'Unknown error',
        },
        { status: 400 }
      );
    }

    const file = formData.get('image') as File;

    let tags = JSON.parse(formData.get('tags') as string);
    let agenda = JSON.parse(formData.get('agenda') as string);

    if (!file) {
      return NextResponse.json(
        {
          message: 'Image file is required',
        },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = `${Date.now()}_${file.name}`;
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: 'image',
            folder: 'DevEvent',
            public_id: `next_tuto/${fileName}`,
          },
          (
            error: UploadApiErrorResponse | undefined,
            result: UploadApiResponse | undefined
          ) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        )
        .end(buffer);
    });

    event.image = (uploadResult as UploadApiResponse).secure_url;

    // Whitelist allowed fields to prevent mass-assignment attacks
    const allowedFields = [
      'title',
      'slug',
      'description',
      'overview',
      'image',
      'date',
      'time',
      'location',
      'mode',
      'agenda',
      'audience',
      'tags',
      'organizer',
    ];

    const eventPayload = Object.fromEntries(
      Object.entries(event).filter(([key]) => allowedFields.includes(key))
    );

    const createdEvent = await Event.create(eventPayload, {
      ...event,
      tags: tags,
      agenda: agenda,
    });

    return NextResponse.json(
      { message: 'Event Created Successfully', event: createdEvent },
      { status: 201 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        message: 'Event Creation Failed',
        error: e instanceof Error ? e.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const events = await Event.find().sort({ createdAt: -1 });
    return NextResponse.json(
      { message: 'Events fetched successfully', events },
      { status: 200 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        message: 'Failed to fetch events',
        error: e instanceof Error ? e.message : 'Unknown error',
      },
      { status: 500 }
    );
  } finally {
    // No need to close the connection here as it's managed by the connection pool
  }
}
