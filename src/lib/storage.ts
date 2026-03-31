import { SavedTrip } from '@/src/types';

const SAVED_TRIPS_KEY = 'cheapvacay.savedTrips';

export function getSavedTrips(): SavedTrip[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(SAVED_TRIPS_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to load saved trips', error);
    return [];
  }
}

export function saveTrip(trip: SavedTrip) {
  if (typeof window === 'undefined') {
    return;
  }

  const existingTrips = getSavedTrips();
  const updatedTrips = [trip, ...existingTrips.filter((item) => item.id !== trip.id)];
  window.localStorage.setItem(SAVED_TRIPS_KEY, JSON.stringify(updatedTrips));
}
