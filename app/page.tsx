import EventCard from '@/components/EventCard';
import ExploreBtn from '@/components/ExploreBtn';
import { IEvent } from '@/database';
import { cacheLife } from 'next/cache';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export default async function Home() {
  let events: IEvent[] = [];

  try {
    const response = await fetch(`${BASE_URL}/api/events`);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch events: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    if (!data.events || !Array.isArray(data.events)) {
      console.error('Invalid events response format');
      events = [];
    } else {
      events = data.events;
    }
  } catch (error) {
    console.error(
      'Error fetching events:',
      error instanceof Error ? error.message : String(error)
    );
    events = [];
  }

  ('use cache');

  cacheLife('hours');
  return (
    <section>
      <h1 className="text-center">
        The hub for every dev <br /> Event you cant miss
      </h1>
      <p className="text-center mt-5">
        Hackathons, Meetups and conferences, All in one Place
      </p>

      <ExploreBtn />

      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>

        <ul className="events">
          {Array.isArray(events) && events.length > 0 ? (
            events.map((event: IEvent, index: number) => (
              <li key={index} className="event-card">
                <EventCard {...event} />
              </li>
            ))
          ) : (
            <li className="text-center text-gray-500">No events available</li>
          )}
        </ul>
      </div>
    </section>
  );
}
