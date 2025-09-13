-- Sample Leave Requests for realistic data
-- This script adds sample leave requests with various statuses

INSERT INTO leave_requests (id, user_id, leave_type_id, start_date, end_date, days_requested, reason, status, approved_by, approved_at, created_at) VALUES

-- Recent Approved Leave Requests
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 1, '2024-12-23', '2024-12-30', 6, 'Christmas vacation with family', 'APPROVED', '550e8400-e29b-41d4-a716-446655440001', '2024-11-15 10:30:00', '2024-11-10 09:15:00'),

('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', 1, '2024-11-01', '2024-11-08', 6, 'Diwali celebration and family visit', 'APPROVED', '550e8400-e29b-41d4-a716-446655440003', '2024-10-20 14:45:00', '2024-10-15 11:20:00'),

('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440007', 1, '2024-09-16', '2024-09-20', 5, 'Long weekend getaway', 'APPROVED', '550e8400-e29b-41d4-a716-446655440006', '2024-09-01 16:20:00', '2024-08-25 13:30:00'),

('650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440011', 1, '2024-08-12', '2024-08-16', 5, 'Summer vacation', 'APPROVED', '550e8400-e29b-41d4-a716-446655440010', '2024-07-28 09:15:00', '2024-07-20 10:45:00'),

-- Pending Leave Requests
('650e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', 1, '2025-01-15', '2025-01-19', 5, 'Winter break extension', 'PENDING', NULL, NULL, '2024-12-20 14:30:00'),

('650e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440009', 1, '2025-02-14', '2025-02-18', 3, 'Long Valentine weekend', 'PENDING', NULL, NULL, '2024-12-15 11:20:00'),

('650e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440013', 1, '2025-03-10', '2025-03-14', 5, 'Spring break plans', 'PENDING', NULL, NULL, '2024-12-10 16:45:00'),

-- Sick Leave Requests
('650e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440016', 2, '2024-11-25', '2024-11-27', 3, 'Flu symptoms and recovery', 'APPROVED', '550e8400-e29b-41d4-a716-446655440015', '2024-11-25 08:30:00', '2024-11-25 08:00:00'),

('650e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440008', 2, '2024-10-15', '2024-10-16', 2, 'Medical appointment and recovery', 'APPROVED', '550e8400-e29b-41d4-a716-446655440001', '2024-10-14 17:00:00', '2024-10-14 16:30:00'),

('650e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440012', 2, '2024-09-05', '2024-09-06', 2, 'Stomach bug', 'APPROVED', '550e8400-e29b-41d4-a716-446655440001', '2024-09-05 07:45:00', '2024-09-05 07:30:00'),

-- Emergency Leave
('650e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440014', 7, '2024-10-28', '2024-10-28', 1, 'Family emergency - urgent', 'APPROVED', '550e8400-e29b-41d4-a716-446655440001', '2024-10-28 11:15:00', '2024-10-28 11:00:00'),

-- Rejected Leave Request
('650e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440011', 1, '2024-12-26', '2024-12-31', 4, 'Extended holiday vacation', 'REJECTED', '550e8400-e29b-41d4-a716-446655440010', '2024-11-20 13:30:00', '2024-11-15 10:15:00'),

-- Personal Leave for Managers
('650e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440003', 3, '2024-07-22', '2024-07-22', 1, 'Personal appointment', 'APPROVED', '550e8400-e29b-41d4-a716-446655440001', '2024-07-20 15:20:00', '2024-07-18 09:30:00'),

('650e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440006', 3, '2024-06-14', '2024-06-14', 1, 'Bank and legal appointments', 'APPROVED', '550e8400-e29b-41d4-a716-446655440001', '2024-06-12 12:45:00', '2024-06-10 14:20:00'),

-- Future Leave Requests
('650e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440004', 1, '2025-06-15', '2025-06-27', 9, 'Summer vacation 2025', 'PENDING', NULL, NULL, '2024-12-01 10:00:00'),

('650e8400-e29b-41d4-a716-446655440016', '550e8400-e29b-41d4-a716-446655440007', 1, '2025-04-25', '2025-05-02', 6, 'Spring vacation and wedding attendance', 'PENDING', NULL, NULL, '2024-11-30 15:30:00'),

('650e8400-e29b-41d4-a716-446655440017', '550e8400-e29b-41d4-a716-446655440010', 1, '2025-07-01', '2025-07-11', 8, 'July 4th extended vacation', 'PENDING', NULL, NULL, '2024-12-05 11:45:00'),

-- Maternity Leave (if applicable)
('650e8400-e29b-41d4-a716-446655440018', '550e8400-e29b-41d4-a716-446655440013', 4, '2025-05-01', '2025-07-30', 90, 'Maternity leave for expected delivery', 'APPROVED', '550e8400-e29b-41d4-a716-446655440012', '2024-12-01 09:00:00', '2024-11-25 16:20:00'),

-- Study Leave for professional development
('650e8400-e29b-41d4-a716-446655440019', '550e8400-e29b-41d4-a716-446655440005', 8, '2025-03-17', '2025-03-21', 5, 'Professional certification exam preparation', 'APPROVED', '550e8400-e29b-41d4-a716-446655440003', '2024-12-08 14:15:00', '2024-12-05 09:40:00'),

-- Additional recent sick leaves
('650e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440015', 2, '2024-12-02', '2024-12-03', 2, 'Migraine and doctor visit', 'APPROVED', '550e8400-e29b-41d4-a716-446655440001', '2024-12-02 08:00:00', '2024-12-02 07:45:00');

-- Add some rejection reasons for rejected requests
UPDATE leave_requests 
SET rejection_reason = 'Peak business period - critical project deadlines. Please reschedule for January.'
WHERE status = 'REJECTED' AND id = '650e8400-e29b-41d4-a716-446655440012';
