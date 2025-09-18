@echo off
echo Testing PostgreSQL connection...
echo Please enter your PostgreSQL password when prompted.
echo.

set PATH=C:\Program Files\PostgreSQL\16\bin;%PATH%

echo Testing connection...
psql -U postgres -h localhost -p 5432 -c "SELECT 'Connection successful!' as result;"

if %errorlevel% equ 0 (
    echo.
    echo ✅ Connection successful! 
    echo Now running database setup scripts...
    echo.
    
    echo Step 1: Creating database and tables...
    psql -U postgres -h localhost -p 5432 -f "01_create_database.sql"
    
    echo Step 2: Inserting seed data...
    psql -U postgres -h localhost -p 5432 -d leave_management_system -f "02_seed_data.sql"
    
    echo Step 3: Adding sample leave requests...
    psql -U postgres -h localhost -p 5432 -d leave_management_system -f "03_sample_leave_requests.sql"
    
    echo Step 4: Adding activities and performance data...
    psql -U postgres -h localhost -p 5432 -d leave_management_system -f "04_sample_activities_performance.sql"
    
    echo.
    echo ✅ Database setup completed successfully!
    echo You can now start your NestJS backend.
) else (
    echo ❌ Connection failed. Please check your PostgreSQL installation and password.
)

pause