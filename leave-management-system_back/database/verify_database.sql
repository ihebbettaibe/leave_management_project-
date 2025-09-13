-- Quick database verification script
-- Run this to test the database connection and data

\c leave_management_system;

-- Check all table counts
SELECT 
    'Summary of Leave Management System Database' as title;

SELECT 
    'Teams' as table_name, 
    COUNT(*) as record_count
FROM teams
UNION ALL
SELECT 
    'Users' as table_name, 
    COUNT(*) as record_count
FROM users
UNION ALL
SELECT 
    'Employee Profiles' as table_name, 
    COUNT(*) as record_count
FROM employee_profiles
UNION ALL
SELECT 
    'Leave Types' as table_name, 
    COUNT(*) as record_count
FROM leave_types
UNION ALL
SELECT 
    'Holidays' as table_name, 
    COUNT(*) as record_count
FROM holidays
UNION ALL
SELECT 
    'Leave Balances' as table_name, 
    COUNT(*) as record_count
FROM leave_balances
UNION ALL
SELECT 
    'Leave Requests' as table_name, 
    COUNT(*) as record_count
FROM leave_requests
UNION ALL
SELECT 
    'Activities' as table_name, 
    COUNT(*) as record_count
FROM activities
UNION ALL
SELECT 
    'Performance Reviews' as table_name, 
    COUNT(*) as record_count
FROM performances;

-- Sample users with their teams and roles
SELECT 
    'Sample Users:' as info;

SELECT 
    u.fullname,
    u.email,
    t.name as team,
    u.roles
FROM users u 
JOIN teams t ON u.team_id = t.id 
WHERE u.roles && ARRAY['HR_MANAGER', 'IT_MANAGER', 'ADMIN']
ORDER BY u.fullname;

-- Sample leave balances for 2025
SELECT 
    'Leave Balances for 2025 (Annual Leave):' as info;

SELECT 
    u.fullname,
    lt.name as leave_type,
    lt.max_days + lb.carryover as total_available,
    lb.used,
    (lt.max_days + lb.carryover - lb.used) as remaining
FROM leave_balances lb
JOIN users u ON lb.user_id = u.id
JOIN leave_types lt ON lb.leave_type_id = lt.id
WHERE lb.year = 2025 AND lt.name = 'Annual Leave'
ORDER BY remaining DESC
LIMIT 8;

-- Recent leave requests
SELECT 
    'Recent Leave Requests:' as info;

SELECT 
    u.fullname,
    lt.name as leave_type,
    lr.start_date,
    lr.end_date,
    lr.days_requested,
    lr.status
FROM leave_requests lr
JOIN users u ON lr.user_id = u.id
JOIN leave_types lt ON lr.leave_type_id = lt.id
ORDER BY lr.created_at DESC
LIMIT 5;
