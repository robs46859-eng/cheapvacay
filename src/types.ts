/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  email: string;
  loyaltyScore: number;
  createdAt: string;
}

export interface Destination {
  id: string;
  name: string;
  region: string;
  country: string;
  baseCostIndex: number; // 1.0 is average
  description: string;
  avgHotelPrice: number;
  imageUrl?: string;
}

export type BudgetLevel = 'budget' | 'mid' | 'luxury';

export interface Trip {
  id: string;
  userId: string;
  origin: string;
  destinationId: string;
  startDate: string;
  endDate: string;
  travelerCount: number;
  budgetLevel: BudgetLevel;
  createdAt: string;
}

export type TransportType = 'bus' | 'taxi';

export interface Route {
  id: string;
  tripId: string;
  type: TransportType;
  duration: number; // in minutes
  estimatedCost: number;
  provider: string;
  metadata: any;
}

export interface Budget {
  id: string;
  tripId: string;
  transportCost: number;
  hotelCost: number;
  foodEstimate: number;
  activitiesCost: number;
  miscCost: number;
  buffer: number;
  totalCost: number;
}

export interface Rating {
  id: string;
  tripId: string;
  costScore: number;
  safetyScore: number;
  comfortScore: number;
  timeScore: number;
  reliabilityScore: number;
}

export interface Deal {
  id: string;
  title: string;
  description: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  eligibilityRule: string;
  expiresAt: string;
}

export interface SavedTrip {
  id: string;
  destinationId: string;
  destinationName: string;
  origin: string;
  startDate: string;
  endDate: string;
  travelerCount: number;
  budgetLevel: BudgetLevel;
  transportLabel: string;
  totalCost: number;
  createdAt: string;
  status: 'draft' | 'ready';
}
