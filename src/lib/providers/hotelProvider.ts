/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Destination } from '@/src/types';

export interface Hotel {
  id: string;
  name: string;
  pricePerNight: number;
  rating: number;
  amenities: string[];
}

export interface HotelProvider {
  name: string;
  getHotels(destination: Destination): Promise<Hotel[]>;
}

export class MockHotelProvider implements HotelProvider {
  name = 'Mock Hotel Provider';

  async getHotels(destination: Destination): Promise<Hotel[]> {
    await new Promise(resolve => setTimeout(resolve, 600));

    return [
      {
        id: 'h1',
        name: `${destination.name} Budget Inn`,
        pricePerNight: destination.avgHotelPrice * 0.8,
        rating: 3.5,
        amenities: ['WiFi', 'Breakfast']
      },
      {
        id: 'h2',
        name: `${destination.name} Heritage Stay`,
        pricePerNight: destination.avgHotelPrice * 1.5,
        rating: 4.5,
        amenities: ['WiFi', 'Pool', 'Restaurant']
      }
    ];
  }
}
