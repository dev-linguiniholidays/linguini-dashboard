-- Linguini Holidays CRM Database Schema
-- Run this in your Supabase SQL Editor

-- Create customers table
CREATE TABLE customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL UNIQUE,
  destination VARCHAR(255),
  status VARCHAR(20) NOT NULL DEFAULT 'fresh' CHECK (status IN ('fresh', 'no-response', 'ongoing', 'converted', 'dead', 'future', 'hot')),
  description TEXT,
  travel_start_date DATE,
  travel_end_date DATE,
  lead_creation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  number_of_pax INTEGER DEFAULT 1 CHECK (number_of_pax > 0),
  package_type VARCHAR(20) NOT NULL DEFAULT 'private' CHECK (package_type IN ('private', 'group')),
  lead_type VARCHAR(20) NOT NULL DEFAULT 'calling' CHECK (lead_type IN ('calling', 'instagram', 'referral', 'website', 'facebook', 'walk-in', 'other')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create comments table
CREATE TABLE customer_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table for authentication
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_customers_status ON customers(status);
CREATE INDEX idx_customers_destination ON customers(destination);
CREATE INDEX idx_customers_package_type ON customers(package_type);
CREATE INDEX idx_customers_lead_type ON customers(lead_type);
CREATE INDEX idx_customers_created_at ON customers(created_at);
CREATE INDEX idx_customer_comments_customer_id ON customer_comments(customer_id);
CREATE INDEX idx_customer_comments_created_at ON customer_comments(created_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO customers (name, phone, destination, status, description, travel_start_date, travel_end_date, lead_creation_date, number_of_pax, package_type, lead_type) VALUES
('Rajesh Kumar', '+91 9876543210', 'Paris, France', 'hot', 'Planning a romantic getaway for anniversary', '2024-02-14', '2024-02-20', '2024-01-10', 2, 'private', 'instagram'),
('Priya Sharma', '+91 9876543211', 'Bali, Indonesia', 'ongoing', 'Family vacation with kids', '2024-03-15', '2024-03-22', '2024-01-15', 4, 'group', 'calling'),
('Amit Patel', '+91 9876543212', 'Dubai, UAE', 'fresh', 'Business trip with leisure', '2024-04-10', '2024-04-15', '2024-01-20', 1, 'private', 'website'),
('Sneha Gupta', '+91 9876543213', 'Thailand', 'converted', 'Honeymoon trip', '2024-05-01', '2024-05-10', '2024-01-25', 2, 'private', 'referral'),
('Vikram Singh', '+91 9876543214', 'Singapore', 'future', 'Corporate retreat', '2024-06-15', '2024-06-20', '2024-01-30', 8, 'group', 'facebook');

-- Insert sample comments
INSERT INTO customer_comments (customer_id, text, user_id, user_name) VALUES
((SELECT id FROM customers WHERE phone = '+91 9876543210'), 'Customer is very interested in luxury accommodations', 'admin', 'Admin User'),
((SELECT id FROM customers WHERE phone = '+91 9876543210'), 'Follow up scheduled for next week', 'admin', 'Admin User'),
((SELECT id FROM customers WHERE phone = '+91 9876543211'), 'Family prefers beach destinations', 'user', 'Sales Rep'),
((SELECT id FROM customers WHERE phone = '+91 9876543212'), 'Budget approved, ready to book', 'admin', 'Admin User');

-- Insert sample users
INSERT INTO users (email, name, role) VALUES
('admin@linguiniholidays.com', 'Admin User', 'admin'),
('sales@linguiniholidays.com', 'Sales Representative', 'user');

-- Enable Row Level Security (RLS)
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (adjust based on your authentication needs)
-- For now, allow all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users" ON customers
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON customer_comments
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON users
    FOR ALL USING (auth.role() = 'authenticated');
