@echo off
echo =================================================
echo    Leave Management System Database Setup
echo =================================================
echo.
echo This will create the 'leave_management_system' database
echo and populate it with sample data.
echo.
echo Make sure you know your PostgreSQL admin password.
echo.
echo Available SQL Scripts:
echo - 01_create_database.sql (Creates database and tables)
echo - 02_seed_data.sql (Adds users, teams, leave types, etc.)
echo - 03_sample_leave_requests.sql (Adds sample leave requests)
echo - 04_sample_activities_performance.sql (Adds activities and performance data)
echo.

set PATH=C:\Program Files\PostgreSQL\16\bin;%PATH%

echo Testing PostgreSQL connection...
echo Enter your PostgreSQL password when prompted:
psql -U postgres -h localhost -p 5432 -c "SELECT 'Connected successfully!' as status;"

if %errorlevel% neq 0 (
    echo.
    echo ❌ Connection failed. Trying port 5433...
    psql -U postgres -h localhost -p 5433 -c "SELECT 'Connected successfully!' as status;"
    
    if %errorlevel% neq 0 (
        echo.
        echo ❌ Connection failed on both ports. Trying port 5434...
        psql -U postgres -h localhost -p 5434 -c "SELECT 'Connected successfully!' as status;"
        
        if %errorlevel% neq 0 (
            echo.
            echo ❌ Cannot connect to PostgreSQL. Please check:
            echo 1. PostgreSQL is running
            echo 2. You're using the correct password
            echo 3. PostgreSQL is accepting connections
            pause
            exit /b 1
        ) else (
            set DB_PORT=5434
        )
    ) else (
        set DB_PORT=5433
    )
) else (
    set DB_PORT=5432
)

echo.
echo ✅ Connected successfully on port %DB_PORT%!
echo.
echo Now setting up the database...
echo.

echo Step 1/4: Creating database and tables...
psql -U postgres -h localhost -p %DB_PORT% -f "01_create_database.sql"
if %errorlevel% neq 0 goto error

echo Step 2/4: Adding seed data (users, teams, leave types)...
psql -U postgres -h localhost -p %DB_PORT% -d leave_management_system -f "02_seed_data.sql"
if %errorlevel% neq 0 goto error

echo Step 3/4: Adding sample leave requests...
psql -U postgres -h localhost -p %DB_PORT% -d leave_management_system -f "03_sample_leave_requests.sql"
if %errorlevel% neq 0 goto error

echo Step 4/4: Adding activities and performance data...
psql -U postgres -h localhost -p %DB_PORT% -d leave_management_system -f "04_sample_activities_performance.sql"
if %errorlevel% neq 0 goto error

echo.
echo ✅ Database setup completed successfully!
echo.
echo 📊 Your database now contains:
echo - 8 Teams (HR, IT, Marketing, Finance, etc.)
echo - 17 Users with different roles
echo - 9 Leave Types (Annual, Sick, Personal, etc.)
echo - Sample leave requests and balances
echo - Performance and activity data
echo.
echo 🔐 Sample login credentials:
echo Admin: admin@company.com / password123
echo HR Manager: sarah.johnson@company.com / password123
echo.
echo Your NestJS backend is now ready to run!
goto end

:error
echo.
echo ❌ Error occurred during database setup.
echo Please check the error messages above.

:end
pause