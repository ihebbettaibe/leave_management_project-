-- Complete Database Setup Script for pgAdmin
-- Run this in pgAdmin after creating the 'leave_management_system' database

-- Enable UUID extension for user IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (optional - for recreation)
DROP TABLE IF EXISTS activities CASCADE;
DROP TABLE IF EXISTS performances CASCADE;
DROP TABLE IF EXISTS leave_requests CASCADE;
DROP TABLE IF EXISTS leave_balances CASCADE;
DROP TABLE IF EXISTS holidays CASCADE;
DROP TABLE IF EXISTS employee_profiles CASCADE;
DROP TABLE IF EXISTS leave_types CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS teams CASCADE;

-- Create tables in the correct order to respect foreign key constraints

-- 1. Teams table
CREATE TABLE teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

-- 2. Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) NOT NULL,
    fullname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP NULL,
    roles TEXT[] DEFAULT '{EMPLOYEE}',
    profile_picture_url VARCHAR(500) NULL,
    bio TEXT NULL,
    address TEXT NULL,
    date_of_birth DATE NULL,
    team_id INTEGER REFERENCES teams(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Leave Types table
CREATE TABLE leave_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    max_days INTEGER NOT NULL
);

-- 4. Employee Profiles table
CREATE TABLE employee_profiles (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    employee_id VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    position VARCHAR(255),
    department VARCHAR(255),
    manager_id UUID REFERENCES users(id),
    hire_date DATE,
    salary DECIMAL(10,2),
    bank_account_number VARCHAR(50),
    social_security_number VARCHAR(20),
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Holidays table
CREATE TABLE holidays (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    type VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Leave Balances table
CREATE TABLE leave_balances (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    leave_type_id INTEGER REFERENCES leave_types(id) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    total_days INTEGER NOT NULL,
    used_days INTEGER DEFAULT 0,
    remaining_days INTEGER NOT NULL,
    carry_over_days INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, leave_type_id, year)
);

-- 7. Leave Requests table
CREATE TABLE leave_requests (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    leave_type_id INTEGER REFERENCES leave_types(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INTEGER NOT NULL,
    reason TEXT,
    status VARCHAR(20) DEFAULT 'PENDING',
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP NULL,
    rejected_reason TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Activities table
CREATE TABLE activities (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    activity_type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Performances table
CREATE TABLE performances (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    review_period VARCHAR(20) NOT NULL,
    year INTEGER NOT NULL,
    overall_rating DECIMAL(3,2),
    goals TEXT,
    achievements TEXT,
    areas_for_improvement TEXT,
    manager_feedback TEXT,
    employee_comments TEXT,
    review_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_team_id ON users(team_id);
CREATE INDEX idx_leave_requests_user_id ON leave_requests(user_id);
CREATE INDEX idx_leave_requests_status ON leave_requests(status);
CREATE INDEX idx_leave_balances_user_id ON leave_balances(user_id);
CREATE INDEX idx_activities_user_id ON activities(user_id);
CREATE INDEX idx_performances_user_id ON performances(user_id);

SELECT 'Database tables created successfully!' as status;