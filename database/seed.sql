-- Starter launch rows. The running app also ships with a richer bundled launch dataset
-- in src/lib/server/launchData.ts and will use that dataset whenever Postgres is not configured.
INSERT INTO destinations (
  id,
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
) VALUES
('manali', 'Manali', 'Himachal Pradesh', 'India', 0.85, 'Popular Himalayan budget base with hostels, Volvo buses from Delhi, and easy access to Solang and Old Manali.', 1700, 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80', 'hill_station', 'north', 'Chandigarh', 'Kullu–Manali', ARRAY['March', 'April', 'May', 'September', 'October'], ARRAY['July', 'August'], ARRAY['Volvo buses from Delhi are usually the best value.', 'Old Manali and Vashisht have deeper budget inventory than luxury resorts.'], 'Autos are limited; budget travelers usually rely on shared cabs, scooters, or short local bus hops.', 1800, 3200, ARRAY['mountains', 'cool-weather', 'hostels'], 4.7),
('jaipur', 'Jaipur', 'Rajasthan', 'India', 0.95, 'Strong first-time India city break with dense hotel supply, rail access, and many paid attractions concentrated near the old city.', 2100, 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80', 'heritage_city', 'north', 'Jaipur Junction', 'Jaipur', ARRAY['October', 'November', 'December', 'January', 'February'], ARRAY['May', 'June'], ARRAY['Train travel keeps Jaipur one of the easiest value breaks from Delhi.', 'Bani Park and MI Road usually give a better stay-price balance than tourist-heavy core areas.'], 'Autos and app cabs are easy, but fort circuits are cheaper if grouped into one day.', 2100, 3600, ARRAY['heritage', 'markets', 'forts'], 4.7),
('goa', 'Goa', 'West Coast', 'India', 1.18, 'Still workable on a budget if timed outside December peaks and split between train arrival and scooter-based local movement.', 2600, 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80', 'beach', 'west', 'Madgaon', 'Goa Mopa / Dabolim', ARRAY['November', 'January', 'February'], ARRAY['December', 'June', 'July', 'August'], ARRAY['South Goa usually gives better room value than peak North Goa strips.', 'Train plus scooter rental beats short-notice flights for budget travelers.'], 'Scooter rental is the key cost-control lever because taxi pricing is punitive on beach circuits.', 2500, 4300, ARRAY['beaches', 'nightlife', 'scooter'], 4.6),
('munnar', 'Munnar', 'Kerala', 'India', 1.05, 'Scenic tea-hill destination where room rates are manageable but last-mile transfers can meaningfully change the total budget.', 2400, 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80', 'hill_station', 'south', 'Aluva', 'Kochi', ARRAY['September', 'October', 'November', 'December', 'January', 'February'], ARRAY['June', 'July'], ARRAY['Munnar is cheaper when paired with bus transfers instead of private cabs from Kochi.', 'Town-center stays are better value than isolated plantation resorts.'], 'Local sightseeing often requires shared jeep, bus, or a negotiated cab day; factor that in early.', 2200, 3800, ARRAY['tea-estates', 'hills', 'scenic'], 4.6),
('varanasi', 'Varanasi', 'Uttar Pradesh', 'India', 0.72, 'One of the easiest ultra-budget cultural trips in India if you keep the stay close to the ghats and lean on train arrivals.', 1300, 'https://images.unsplash.com/photo-1561361058-c24cecae35ca?auto=format&fit=crop&w=1200&q=80', 'pilgrimage', 'north', 'Varanasi Junction', 'Varanasi', ARRAY['October', 'November', 'December', 'January', 'February'], ARRAY['May', 'June', 'July'], ARRAY['Few destinations match Varanasi on low accommodation spend.', 'Boats and guided experiences are where budgets usually creep.'], 'Ghats are best explored on foot; use e-rickshaw or auto only for station and farther temples.', 1500, 2600, ARRAY['spiritual', 'culture', 'ghats'], 4.6);

-- Seed Deals
INSERT INTO deals (id, title, description, code, discount_type, value, eligibility_rule, expires_at) VALUES
('deal-shoulder-season', 'Shoulder Season Stay Strategy', 'Prioritize March-April or September-October for mountain and heritage routes to unlock better room rates without monsoon tradeoffs.', 'SHOULDERSMART', 'percentage', 12, 'Best fit for destinations where weather remains stable outside long-weekend peaks.', 'Launch season'),
('deal-rail-first', 'Rail-First Budget Combo', 'On long corridors, overnight train plus central guesthouse usually beats budget flights once airport transfers are counted.', 'RAILFIRST', 'fixed', 1800, 'Works best for 3-night-plus itineraries where one overnight train saves a hotel night.', 'Launch season');
