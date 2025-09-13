@echo off
REM Database Setup Script for Leave Management System (Windows)
REM This script will create the new database and populate it with sample data

echo Starting database setup for Leave Management System...

REM Database configuration
set DB_NAME=leave_management_system
set DB_USER=postgres
set DB_HOST=localhost
set DB_PORT=5432

echo Please ensure PostgreSQL is running and you have admin access
set /p DB_PASSWORD=Enter PostgreSQL password for user '%DB_USER%': 

echo.

REM Function to run SQL file
:run_sql_file
set file=%~1
set description=%~2

echo %description%...

set PGPASSWORD=%DB_PASSWORD%
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -f "%file%" >nul 2>&1

if %errorlevel% equ 0 (
    echo [32m✓ %description% completed successfully[0m
) else (
    echo [31m✗ Error in %description%[0m
    echo Please check the error and try again.
    pause
    exit /b 1
)
goto :eof

REM Create database and tables
call :run_sql_file "01_create_database.sql" "Creating database and tables"

REM Populate with seed data
echo Inserting seed data...
set PGPASSWORD=%DB_PASSWORD%
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f "02_seed_data.sql" >nul 2>&1

if %errorlevel% equ 0 (
    echo [32m✓ Seed data inserted successfully[0m
) else (
    echo [31m✗ Error inserting seed data[0m
    pause
    exit /b 1
)

REM Add sample leave requests
echo Adding sample leave requests...
set PGPASSWORD=%DB_PASSWORD%
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f "03_sample_leave_requests.sql" >nul 2>&1

if %errorlevel% equ 0 (
    echo [32m✓ Sample leave requests added successfully[0m
) else (
    echo [31m✗ Error adding sample leave requests[0m
    pause
    exit /b 1
)

REM Add activities and performance data
echo Adding activities and performance data...
set PGPASSWORD=%DB_PASSWORD%
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f "04_sample_activities_performance.sql" >nul 2>&1

if %errorlevel% equ 0 (
    echo [32m✓ Activities and performance data added successfully[0m
) else (
    echo [31m✗ Error adding activities and performance data[0m
    pause
    exit /b 1
)

echo.
echo ==========================================
echo Database setup completed successfully!
echo ==========================================
echo.

REM Display summary
echo Database Summary:
echo Database Name: %DB_NAME%
echo Host: %DB_HOST%:%DB_PORT%

REM Count records
echo.
echo Sample Data Summary:
set PGPASSWORD=%DB_PASSWORD%
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -t -c "SELECT 'Teams: ' || COUNT(*) FROM teams UNION ALL SELECT 'Users: ' || COUNT(*) FROM users UNION ALL SELECT 'Employee Profiles: ' || COUNT(*) FROM employee_profiles UNION ALL SELECT 'Leave Types: ' || COUNT(*) FROM leave_types UNION ALL SELECT 'Holidays: ' || COUNT(*) FROM holidays UNION ALL SELECT 'Leave Balances: ' || COUNT(*) FROM leave_balances UNION ALL SELECT 'Leave Requests: ' || COUNT(*) FROM leave_requests UNION ALL SELECT 'Activities: ' || COUNT(*) FROM activities UNION ALL SELECT 'Performance Reviews: ' || COUNT(*) FROM performances;"

echo.
echo Sample Login Credentials:
echo =========================
echo Admin User:
echo   Email: admin@company.com
echo   Password: password123
echo.
echo HR Manager:
echo   Email: sarah.johnson@company.com
echo   Password: password123
echo.
echo IT Manager:
echo   Email: david.wilson@company.com
echo   Password: password123
echo.
echo Regular Employee:
echo   Email: emily.davis@company.com
echo   Password: password123
echo.

echo You can now start your NestJS application!
pause
