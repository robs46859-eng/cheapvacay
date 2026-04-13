import { Pool } from 'pg';
import type { Deal } from '../../types';
import { launchDeals, launchDestinations, type LaunchDestination } from './launchData';

type DatabaseDestinationRow = {
  id: string;
  name: string;
  region: string;
  country: string;
  base_cost_index: number;
  description: string;
  avg_hotel_price: number;
  image_url: string | null;
  travel_profile: LaunchDestination['travelProfile'];
  zone: LaunchDestination['zone'];
  nearest_rail_hub: string;
  nearest_airport: string;
  best_months: string[] | null;
  avoid_months: string[] | null;
  budget_highlights: string[] | null;
  local_transport_note: string | null;
  sample_budget_per_day: number | null;
  sample_mid_budget_per_day: number | null;
  tags: string[] | null;
  planning_score: number | null;
};

type DatabaseDealRow = {
  id: string;
  title: string;
  description: string;
  code: string;
  discount_type: Deal['discountType'];
  value: number;
  eligibility_rule: string;
  expires_at: string;
};

let pool: Pool | null = null;
let warnedAboutDatabase = false;

function getPool() {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  if (!pool) {
    const ssl = process.env.DATABASE_SSL === 'true'
      ? { rejectUnauthorized: false }
      : undefined;

    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl,
    });
  }

  return pool;
}

function warnDatabaseFallback(error: unknown) {
  if (warnedAboutDatabase) {
    return;
  }

  warnedAboutDatabase = true;
  console.warn('[CheapVacay] Falling back to bundled launch data because Postgres is unavailable.', error);
}

function mapDestinationRow(row: DatabaseDestinationRow): LaunchDestination {
  return {
    id: row.id,
    name: row.name,
    region: row.region,
    country: row.country,
    baseCostIndex: Number(row.base_cost_index),
    description: row.description,
    avgHotelPrice: Number(row.avg_hotel_price),
    imageUrl: row.image_url ?? undefined,
    travelProfile: row.travel_profile,
    zone: row.zone,
    nearestRailHub: row.nearest_rail_hub,
    nearestAirport: row.nearest_airport,
    bestMonths: row.best_months ?? [],
    avoidMonths: row.avoid_months ?? [],
    budgetHighlights: row.budget_highlights ?? [],
    localTransportNote: row.local_transport_note ?? '',
    sampleBudgetPerDay: Number(row.sample_budget_per_day ?? 0),
    sampleMidBudgetPerDay: Number(row.sample_mid_budget_per_day ?? 0),
    tags: row.tags ?? [],
    planningScore: Number(row.planning_score ?? 4.4),
  };
}

function mapDealRow(row: DatabaseDealRow): Deal {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    code: row.code,
    discountType: row.discount_type,
    value: Number(row.value),
    eligibilityRule: row.eligibility_rule,
    expiresAt: row.expires_at,
  };
}

export async function getDestinations(): Promise<LaunchDestination[]> {
  const activePool = getPool();
  if (!activePool) {
    return launchDestinations;
  }

  try {
    const result = await activePool.query<DatabaseDestinationRow>(`
      SELECT
        id::text,
        name,
        region,
        country,
        base_cost_index,
        description,
        avg_hotel_price,
        image_url,
        travel_profile,
        zone,
        nearest_rail_hub,
        nearest_airport,
        best_months,
        avoid_months,
        budget_highlights,
        local_transport_note,
        sample_budget_per_day,
        sample_mid_budget_per_day,
        tags,
        planning_score
      FROM destinations
      ORDER BY planning_score DESC, base_cost_index ASC, name ASC
    `);

    return result.rows.map(mapDestinationRow);
  } catch (error) {
    warnDatabaseFallback(error);
    return launchDestinations;
  }
}

export async function getDestinationById(id: string) {
  const destinations = await getDestinations();
  return destinations.find((destination) => destination.id === id) ?? null;
}

export async function getDeals(): Promise<Deal[]> {
  const activePool = getPool();
  if (!activePool) {
    return launchDeals;
  }

  try {
    const result = await activePool.query<DatabaseDealRow>(`
      SELECT
        id::text,
        title,
        description,
        code,
        discount_type,
        value,
        eligibility_rule,
        expires_at
      FROM deals
      ORDER BY title ASC
    `);

    return result.rows.map(mapDealRow);
  } catch (error) {
    warnDatabaseFallback(error);
    return launchDeals;
  }
}
