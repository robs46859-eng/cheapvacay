-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    loyalty_score INTEGER DEFAULT 0
);

-- Destinations Table
CREATE TABLE destinations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    region VARCHAR(255),
    country VARCHAR(255) DEFAULT 'India',
    base_cost_index DECIMAL(3, 2) DEFAULT 1.0,
    description TEXT,
    avg_hotel_price DECIMAL(10, 2),
    image_url TEXT
);

-- Trips Table
CREATE TABLE trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    origin VARCHAR(255) NOT NULL,
    destination_id UUID REFERENCES destinations(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    traveler_count INTEGER DEFAULT 1,
    budget_level VARCHAR(50) DEFAULT 'budget',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Routes Table
CREATE TABLE routes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID REFERENCES trips(id),
    type VARCHAR(50) NOT NULL, -- 'bus', 'taxi'
    duration INTEGER, -- in minutes
    estimated_cost DECIMAL(10, 2),
    provider VARCHAR(255),
    metadata JSONB
);

-- Hotels Table
CREATE TABLE hotels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    destination_id UUID REFERENCES destinations(id),
    name VARCHAR(255) NOT NULL,
    price_per_night DECIMAL(10, 2),
    rating DECIMAL(3, 2),
    metadata JSONB
);

-- Stops Table
CREATE TABLE stops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    route_id UUID REFERENCES routes(id),
    name VARCHAR(255) NOT NULL,
    cost_impact DECIMAL(10, 2) DEFAULT 0,
    duration_impact INTEGER DEFAULT 0
);

-- Budgets Table
CREATE TABLE budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID REFERENCES trips(id),
    transport_cost DECIMAL(10, 2) DEFAULT 0,
    hotel_cost DECIMAL(10, 2) DEFAULT 0,
    food_estimate DECIMAL(10, 2) DEFAULT 0,
    activities_cost DECIMAL(10, 2) DEFAULT 0,
    misc_cost DECIMAL(10, 2) DEFAULT 0,
    buffer DECIMAL(10, 2) DEFAULT 0,
    total_cost DECIMAL(10, 2) DEFAULT 0
);

-- Ratings Table
CREATE TABLE ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID REFERENCES trips(id),
    cost_score INTEGER,
    safety_score INTEGER,
    comfort_score INTEGER,
    time_score INTEGER,
    reliability_score INTEGER
);

-- Deals Table
CREATE TABLE deals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    discount_type VARCHAR(50), -- 'percentage', 'fixed'
    value DECIMAL(10, 2),
    eligibility_rule TEXT,
    expires_at TIMESTAMP WITH TIME ZONE
);
