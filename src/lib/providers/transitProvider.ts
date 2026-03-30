/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Route, Destination, TransportType } from '@/src/types';

export interface TransitProvider {
  name: string;
  getRoutes(origin: string, destination: Destination): Promise<Route[]>;
}

export class MockTransitProvider implements TransitProvider {
  name = 'Mock Transit Provider';

  async getRoutes(origin: string, destination: Destination): Promise<Route[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    return [
      {
        id: Math.random().toString(36).substr(2, 9),
        tripId: '',
        type: 'bus' as TransportType,
        duration: 480,
        estimatedCost: 800 * destination.baseCostIndex,
        provider: 'State Transport (SRTC)',
        metadata: { stops: 4, amenities: ['AC', 'Recliner'] }
      },
      {
        id: Math.random().toString(36).substr(2, 9),
        tripId: '',
        type: 'taxi' as TransportType,
        duration: 360,
        estimatedCost: 3500 * destination.baseCostIndex,
        provider: 'Private Operator',
        metadata: { stops: 2, car_type: 'Sedan' }
      }
    ];
  }
}
