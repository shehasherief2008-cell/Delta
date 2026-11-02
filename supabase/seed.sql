-- ==============================================================================
-- RESCUEPLATE SEED DATA FOR SUPABASE
-- ==============================================================================

-- Sample Organizations
INSERT INTO public.organizations (id, name, type, address, city, lat, lng, capacity_kg, is_verified)
VALUES
  ('a0000000-0000-0000-0000-000000000001', 'The Grand Pavilion Hotel', 'Hotel', '450 Harbor Boulevard', 'Metro City', 37.7760, -122.4170, 200.0, true),
  ('a0000000-0000-0000-0000-000000000002', 'Hope Community Kitchen & Shelter', 'Community Kitchen', '124 Elm Street', 'Metro City', 37.7749, -122.4194, 150.0, true),
  ('a0000000-0000-0000-0000-000000000003', 'St. Jude Family Care Center', 'NGO', '89 Mission Way', 'Metro City', 37.7650, -122.4280, 80.0, true)
ON CONFLICT DO NOTHING;

-- Sample Impact Events
INSERT INTO public.impact_events (id, donation_id, meals_served, kg_diverted, co2e_avoided_kg, verified_at)
VALUES
  (uuid_generate_v4(), 'b0000000-0000-0000-0000-000000000007', 40, 16.0, 40.0, NOW() - INTERVAL '1 day'),
  (uuid_generate_v4(), 'b0000000-0000-0000-0000-000000000008', 120, 50.0, 125.0, NOW() - INTERVAL '2 days')
ON CONFLICT DO NOTHING;

