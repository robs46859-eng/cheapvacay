-- Seed Destinations
INSERT INTO destinations (name, region, country, base_cost_index, description, avg_hotel_price, image_url) VALUES
('Manali', 'Himachal Pradesh', 'India', 0.8, 'A high-altitude Himalayan resort town known for its cool climate and snow-capped mountains.', 1500, 'https://picsum.photos/seed/manali/800/600'),
('Goa', 'West Coast', 'India', 1.2, 'Famous for its beaches, nightlife, and Portuguese heritage.', 2500, 'https://picsum.photos/seed/goa/800/600'),
('Jaipur', 'Rajasthan', 'India', 1.0, 'The Pink City, known for its historic forts and palaces.', 2000, 'https://picsum.photos/seed/jaipur/800/600'),
('Munnar', 'Kerala', 'India', 1.1, 'A town in the Western Ghats mountain range, famous for its tea plantations and rolling hills.', 2200, 'https://picsum.photos/seed/munnar/800/600'),
('Varanasi', 'Uttar Pradesh', 'India', 0.7, 'One of the oldest continuously inhabited cities in the world, spiritual capital of India.', 1200, 'https://picsum.photos/seed/varanasi/800/600');

-- Seed Deals
INSERT INTO deals (title, discount_type, value, eligibility_rule, expires_at) VALUES
('Early Bird: 20% Off Manali Hotels', 'percentage', 20, 'Book 30 days in advance', NOW() + INTERVAL '30 days'),
('State Bus Pass: Flat ₹200 Off', 'fixed', 200, 'Valid on all state transport buses', NOW() + INTERVAL '15 days');
